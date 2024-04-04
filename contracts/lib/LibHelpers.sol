// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "./LibHelpers.sol";
import "../interfaces/IERC173.sol";

library LibHelpers {
  address internal constant ZERO_ADDRESS = address(0);
  address internal constant DEPLOYER_CONTRACT = 0x6DF2D25d8C6FD680730ee658b530A05a99BB769a;
  // SEE: https://github.com/safe-global/safe-singleton-factory
  address internal constant DEPLOYER_CONTRACT_EIP155 = 0x914d7Fec6aaC8cd542e72Bca78B30650d45643d7;

  function _isDiamondFacet(address who) internal view returns (bool) {
    return who == address(this);
  }

  function _isDiamondOwner(address who) internal view returns (bool) {
    return who == IERC173(address(this)).owner();
  }

  function _isDeployer(address who) internal pure returns (bool) {
    return (who == LibHelpers.DEPLOYER_CONTRACT) || (who == LibHelpers.DEPLOYER_CONTRACT_EIP155);
  }
}
