import { task, types } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { BigNumber } from 'ethers';
import '@openzeppelin/hardhat-upgrades';
import { checkNetwork, fromBaseUnit, toBaseUnit } from '../utils';
import { StateManager } from '../StateManager';
import { FastToken } from '../../typechain-types/contracts/FastToken';
import { FastAccess, FastHistory, FastRegistry } from '../../typechain-types';

// Tasks.

interface FastDeployParams {
  readonly spc: string;
  readonly governor: string;
  readonly name: string;
  readonly symbol: string;
  readonly decimals: number;
  readonly hasFixedSupply: boolean;
};

task('fast-deploy', 'Deploys a FAST')
  .addParam('spc', 'The address at which the main SPC is deployed', undefined, types.string)
  .addParam('governor', 'The address of the FAST governor', undefined, types.string)
  .addParam('name', 'The name for the new FAST', undefined, types.string)
  .addParam('symbol', 'The symbol for the new FAST', undefined, types.string)
  .addOptionalParam('decimals', 'The decimals for the new FAST', 18, types.int)
  .addOptionalParam('hasFixedSupply', 'The minting scheme for the new FAST', true, types.boolean)
  .setAction(async (params: FastDeployParams, hre) => {
    checkNetwork(hre);

    // Check current state.
    const stateManager = new StateManager(31337);
    // Check for libraries...
    if (!stateManager.state.AddressSetLib) { throw 'Missing AddressSetLib library' }
    else if (!stateManager.state.PaginationLib) { throw 'Missing PaginationLib library' }

    const addressSetLibAddr: string = stateManager.state.AddressSetLib;
    const paginationLibAddr: string = stateManager.state.PaginationLib;

    // Grab a handle on the deployed SPC contract.
    const spc = await hre.ethers.getContractAt('Spc', params.spc);
    const [[spcMemberAddr],] = await spc.paginateMembers(0, 1);
    // Grab a signer to the SPC member.
    const spcMember = await hre.ethers.getSigner(spcMemberAddr);

    // First, deploy a registry contract.
    const registry = await deployFastRegistry(hre, params.spc);
    const spcMemberRegistry = registry.connect(spcMember);
    console.log('Deployed FastRegistry', registry.address);

    // First, deploy an access contract, required for the FAST permissioning.
    const access = await deployFastAccess(hre, addressSetLibAddr, paginationLibAddr, registry.address, params.governor);
    console.log('Deployed FastAccess', access.address);
    // Tell our registry where our access contract is.
    await spcMemberRegistry.setAccessAddress(access.address);

    // We can now deploy a history contract.
    const history = await deployFastHistory(hre, paginationLibAddr, registry.address);
    console.log('Deployed FastHistory', history.address);
    // Tell our registry where our history contract is.
    await spcMemberRegistry.setHistoryAddress(history.address);

    // We can finally deploy our token contract.
    const token = await deployFastToken(hre, registry.address, params);
    console.log('Deployed FastToken', token.address);
    // Tell our registry where our token contract is.
    await spcMemberRegistry.setTokenAddress(token.address);
  });

interface FastMintParams {
  readonly fast: string;
  readonly account: string;
  readonly amount: number;
  readonly ref: string;
};

task('fast-mint', 'Mints FASTs to a specified recipient')
  .addPositionalParam('fast', 'The FAST Token address to operate on', undefined, types.string)
  .addParam('amount', 'The amount of tokens to mint', undefined, types.int)
  .addParam('ref', 'The reference to use for the minting operation', undefined, types.string)
  .setAction(async (params: FastMintParams, hre) => {
    checkNetwork(hre);

    const { ethers } = hre;
    const fast = await ethers.getContractAt('FastToken', params.fast) as FastToken;
    const { symbol, decimals, baseAmount } = await fastMint(fast, params.amount, params.ref);
    console.log(`Minted ${symbol}:`);
    console.log(`  In base unit: =${baseAmount}`);
    console.log(`    Human unit: ~${fromBaseUnit(baseAmount, decimals)} (${decimals} decimals truncated)`);
  });

interface FastAddTransferCreditsParamms {
  readonly spc: string;
  readonly fast: string;
  readonly credits: number;
};

task('fast-add-transfer-credits', 'Increases the transfer credits for a given FAST Token')
  .addPositionalParam('fast', 'The FAST Token address to operate on', undefined, types.string)
  .addParam('spc', 'The address at which the main SPC contract is deployed', undefined, types.string)
  .addParam('credits', 'How many credits should be added', undefined, types.int)
  .setAction(async (params: FastAddTransferCreditsParamms, hre) => {
    const { ethers } = hre;

    // Grab a handle on the deployed SPC contract.
    const spc = await hre.ethers.getContractAt('Spc', params.spc);
    const [[spcMemberAddr],] = await spc.paginateMembers(0, 1);
    // Grab a signer to the SPC member.
    const spcMember = await hre.ethers.getSigner(spcMemberAddr);

    const fast = await ethers.getContractAt('FastToken', params.fast) as FastToken;
    await fastAddTransferCredits(fast.connect(spcMember), params.credits);
  });

interface FastBalanceParams {
  readonly fast: string;
  readonly account: string;
};

task('fast-balance', 'Retrieves the balance of a given account')
  .addPositionalParam('fast', 'The FAST address to operate on', undefined, types.string)
  .addParam('account', 'The account to retrieve the balance of', undefined, types.string)
  .setAction(async (params: FastBalanceParams, hre) => {
    checkNetwork(hre);

    const { ethers } = hre;
    const fast = await ethers.getContractAt('FastToken', params.fast);

    const decimals = await fast.decimals();
    const symbol = await fast.symbol();
    const baseBalance = await fast.balanceOf(params.account);
    console.log(`${symbol} balance of ${params.account}:`);
    console.log(`  In base unit: =${baseBalance}`);
    console.log(`    Human unit: ~${fromBaseUnit(baseBalance, decimals)} (${decimals} decimals truncated)`);
  });

/// Reusable functions.

// Deploys a FAST Registry contract.
async function deployFastRegistry(
  { ethers, upgrades }: HardhatRuntimeEnvironment,
  spcAddr: string): Promise<FastRegistry> {
  const Registry = await ethers.getContractFactory('FastRegistry');
  return await upgrades.deployProxy(Registry, [spcAddr]) as FastRegistry;
};

// Deploys a new FAST Access contract.
async function deployFastAccess(
  { ethers, upgrades }: HardhatRuntimeEnvironment,
  addressSetLibAddr: string,
  paginationLibAddr: string,
  regAddr: string,
  member: string): Promise<FastAccess> {
  const libraries = { AddressSetLib: addressSetLibAddr, PaginationLib: paginationLibAddr }
  const Access = await ethers.getContractFactory('FastAccess', { libraries });
  return await upgrades.deployProxy(Access, [regAddr, member]) as FastAccess;
}

// Deploys a FAST History contract.
async function deployFastHistory(
  { ethers, upgrades }: HardhatRuntimeEnvironment,
  paginationLibAddr: string,
  registryAddress: string): Promise<FastHistory> {
  const libraries = { PaginationLib: paginationLibAddr };
  const History = await ethers.getContractFactory('FastHistory', { libraries });
  return await upgrades.deployProxy(History, [registryAddress]) as FastHistory;
}

// Deploys a new FAST Token contract.
async function deployFastToken(
  { ethers, upgrades }: HardhatRuntimeEnvironment,
  accessAddress: string,
  params: any): Promise<FastToken> {
  const { name, symbol, decimals } = params;
  const { hasFixedSupply } = params;
  const hasFixedSupplyBool = hasFixedSupply === true || hasFixedSupply === "true";

  // Deploy the token contract.
  const Token = await ethers.getContractFactory('FastToken');
  return await upgrades.deployProxy(Token, [accessAddress, name, symbol, decimals, hasFixedSupplyBool]) as FastToken;
}

async function fastMint(fast: FastToken, amount: number | BigNumber, ref: string) {
  const decimals = await fast.decimals();
  const symbol = await fast.symbol();
  const baseAmount = toBaseUnit(BigNumber.from(amount), decimals);
  await fast.mint(baseAmount, ref);
  return { symbol, decimals, baseAmount };
}

async function fastAddTransferCredits(fast: FastToken, credits: number | BigNumber) {
  const decimals = await fast.decimals();
  await fast.addTransferCredits(toBaseUnit(BigNumber.from(credits), decimals));
}

export {
  deployFastRegistry,
  deployFastAccess,
  deployFastHistory,
  deployFastToken,
  fastMint,
  fastAddTransferCredits
};
