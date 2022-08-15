import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers, getNamedAccounts } from 'hardhat';
import { fastMint } from '../tasks/fast';
import { Marketplace, Fast } from '../typechain';
import { toBaseUnit, ZERO_ADDRESS } from '../src/utils';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // We only want to do this in local development nodes.
  const { name: netName } = hre.network;
  if (netName != 'hardhat' && netName != 'localhost' && netName != 'dev') { return; }

  const {
    fastGovernor, issuerMember,
    user1, user2, user3, user4, user5, user6, user7, user8, user9, user10
  } = await getNamedAccounts();
  // Grab various accounts.
  const issuerMemberSigner = await ethers.getSigner(issuerMember);
  const fastGovernorSigner = await ethers.getSigner(fastGovernor);
  // Grab handles to the Marketplace.
  const marketplace = await ethers.getContract<Marketplace>('Marketplace');
  const issuerMemberMarketplace = marketplace.connect(issuerMemberSigner);
  // Grab handles to the IOU FAST.
  const iou = await ethers.getContract<Fast>('FastIOU');
  const governedIOU = iou.connect(issuerMemberSigner);

  console.log('Adding user[1-10] to the Marketplace as members...');
  for (const addr of [user1, user2, user3, user4, user5, user6, user7, user8, user9, user10]) {
    if (!(await marketplace.isMember(addr))) {
      console.log(`  ${addr}...`);
      await (await issuerMemberMarketplace.addMember(addr)).wait();
    }
  }

  console.log('Minting 1_000_000 IOU...');
  await fastMint(governedIOU, 1_000_000, 'Initial mint');

  console.log('Provisioning user[1, 4, 5, 8, 9] with some IOU...');
  for (const addr of [user1, user4, user5, user8, user9]) {
    console.log(`  ${addr}...`);
    await (await governedIOU.transferFrom(ZERO_ADDRESS, addr, toBaseUnit(1_000, 18))).wait();
  }

  const governedF01 = (await ethers.getContract('FastF01')).connect(fastGovernorSigner);
  console.log('Adding user[1-5] as members of the F01 FAST...');
  for (const addr of [user1, user2, user3, user4, user5]) {
    console.log(`  ${addr}...`);
    await (await governedF01.addMember(addr)).wait();
  }
  console.log('Transferring F01 to user[1-3]...');
  for (const [index, addr] of [user1, user2, user3].entries()) {
    console.log(`  ${addr} ${index}...`);
    await (await governedF01.transferFromWithRef(
      ZERO_ADDRESS, addr, toBaseUnit(1_000 * (index + 1), 18), `Transfer ${index + 1}`)
    ).wait();
  }

  const governedF02 = (await ethers.getContract('FastF02')).connect(fastGovernorSigner);
  console.log('Adding user[3-7] as members of the F02 FAST...');
  for (const addr of [user3, user4, user5, user6, user7]) {
    console.log(`  ${addr}...`);
    await (await governedF02.addMember(addr)).wait();
  }
};
func.tags = ['SeedDevEnv'];
export default func;
