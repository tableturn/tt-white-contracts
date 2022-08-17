// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;


interface IFast {
  function isSemiPublic() external view returns(bool);
  function hasFixedSupply() external view returns(bool);
}
