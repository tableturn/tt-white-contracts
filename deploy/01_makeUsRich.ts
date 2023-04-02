import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  // We only want to do this in local development nodes.
  const {
    network: { name: netName },
  } = hre;
  if (netName !== "hardhat" && netName !== "localhost") {
    return;
  }
  console.log("------------------------------------------------ 01_makeUsRich");

  const signers = await hre.ethers.getSigners();
  await Promise.all(
    signers.map(async ({ address }) => {
      console.log(`Account ${address} be filthy rich!`);
      return hre.network.provider.send("hardhat_setBalance", [address, "0xC9F2C9CD04674EDEA40000000"]);
    }),
  );
};
func.tags = ["MakeUsRich"];
export default func;
