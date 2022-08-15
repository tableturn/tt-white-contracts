import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // We only want to do this in local development nodes.
  const { network: { name: netName } } = hre;
  if (netName != 'hardhat' && netName != 'localhost') { return; }
};
func.tags = ['FundIssuer'];
export default func;
