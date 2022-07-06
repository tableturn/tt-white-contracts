import * as chai from 'chai';
import { expect } from 'chai';
import { solidity } from 'ethereum-waffle';
import { BigNumber } from 'ethers';
import { deployments, ethers } from 'hardhat';
import { FakeContract, smock } from '@defi-wonderland/smock';
import { SignerWithAddress } from 'hardhat-deploy-ethers/signers';
import { negOneHundred, oneHundred, ninety, REQUIRES_SPC_MEMBERSHIP, MISSING_ATTACHED_ETH, INTERNAL_METHOD } from '../utils';
import { DEPLOYER_FACTORY_COMMON, toHexString } from '../../src/utils';
import { Spc, Exchange, Fast, FastTopFacet } from '../../typechain';
chai.use(solidity);
chai.use(smock.matchers);

interface FastFixtureOpts {
  // Ops variables.
  deployer: string;
  governor: string;
  exchange: string;
  // Config.
  spc: string,
  name: string;
  symbol: string;
  decimals: BigNumber;
  hasFixedSupply: boolean;
  isSemiPublic: boolean;
}

// TODO: We probably want to remove FastAccessFacet and FastFrontendFacet and replace them by fakes...
const FAST_FACETS = [
  'FastTopFacet',
  'FastAccessFacet',
  'FastFrontendFacet'
];

const fastDeployFixture = deployments.createFixture(async (hre, uOpts) => {
  const initOpts = uOpts as FastFixtureOpts;
  const { deployer, ...initFacetArgs } = initOpts;
  // Deploy the diamond.
  return await deployments.diamond.deploy('Fast', {
    from: initOpts.deployer,
    owner: initOpts.deployer,
    facets: FAST_FACETS,
    execute: {
      contract: 'FastInitFacet',
      methodName: 'initialize',
      args: [initFacetArgs],
    },
    deterministicSalt: DEPLOYER_FACTORY_COMMON.salt
  });
});

describe('FastTopFacet', () => {
  let
    deployer: SignerWithAddress,
    spcMember: SignerWithAddress,
    governor: SignerWithAddress,
    bob: SignerWithAddress;
  let spc: FakeContract<Spc>,
    exchange: FakeContract<Exchange>,
    token: FastTopFacet,
    spcMemberToken: FastTopFacet,
    deployerToken: FastTopFacet;

  before(async () => {
    // Keep track of a few signers.
    [deployer, spcMember, governor, bob] = await ethers.getSigners();
    // Mock an SPC and an Exchange contract.
    spc = await smock.fake('Spc');
    exchange = await smock.fake('Exchange');
    exchange.spcAddress.returns(spc.address);
  });

  beforeEach(async () => {
    spc.isMember.whenCalledWith(spcMember.address).returns(true);
    spc.isMember.returns(false);

    const initOpts: FastFixtureOpts = {
      deployer: deployer.address,
      governor: governor.address,
      exchange: exchange.address,
      spc: spc.address,
      name: 'Better, Stronger, FASTer',
      symbol: 'BSF',
      decimals: BigNumber.from(18),
      hasFixedSupply: true,
      isSemiPublic: true
    };
    const deploy = await fastDeployFixture(initOpts);
    const fast = await ethers.getContractAt('Fast', deploy.address) as Fast;

    // TODO: Once smock fixes their stuff. replace facets by fakes.

    token = fast as FastTopFacet;
    spcMemberToken = token.connect(spcMember);
    deployerToken = token.connect(deployer);
  });

  // Getters.

  describe('spcAddress', async () => {
    it('returns the SPC address', async () => {
      const subject = await spcMemberToken.spcAddress();
      expect(subject).to.eq(spc.address);
    });
  });

  describe('exchangeAddress', async () => {
    it('returns the exchange address', async () => {
      const subject = await spcMemberToken.exchangeAddress();
      expect(subject).to.eq(exchange.address);
    });
  });

  // Provisioning functions.

  describe('provisionWithEth', async () => {
    it('reverts when no Eth is attached', async () => {
      const subject = spcMemberToken.provisionWithEth();
      await expect(subject).to.be
        .revertedWith(MISSING_ATTACHED_ETH);
    });

    it('emits a EthReceived event', async () => {
      const subject = spcMemberToken.provisionWithEth({ value: ninety });
      await expect(subject).to
        .emit(token, 'EthReceived')
        .withArgs(spcMember.address, ninety)
    });
  });

  describe('drainEth', async () => {
    it('requires SPC membership', async () => {
      const subject = token.drainEth();
      await expect(subject).to.be
        .revertedWith(REQUIRES_SPC_MEMBERSHIP);
    });

    it('transfers all the locked Eth to the caller', async () => {
      // Provision the token with a lot of Eth.
      await ethers.provider.send("hardhat_setBalance", [token.address, toHexString(oneHundred)]);
      // Drain the token.
      const subject = async () => await spcMemberToken.drainEth();
      await expect(subject).to.changeEtherBalances([token, spcMember], [negOneHundred, oneHundred]);
    });

    it('emits a EthDrained event', async () => {
      // Provision the token with a lot of Eth.
      await ethers.provider.send("hardhat_setBalance", [token.address, toHexString(oneHundred)]);
      // Drain the token.
      const subject = spcMemberToken.drainEth();
      await expect(subject).to
        .emit(token, 'EthDrained')
        .withArgs(spcMember.address, oneHundred);
    });
  });

  describe('payUpTo', async () => {
    it('cannot be called directly', async () => {
      await expect(spcMemberToken.payUpTo(bob.address, ninety)).to.be
        .revertedWith(INTERNAL_METHOD);
    });

    it('requires the recipient to be non-zero address');
  });
});
