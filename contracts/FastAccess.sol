// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import './interfaces/IFastAccess.sol';
import './FastRegistry.sol';
import './lib/AddressSetLib.sol';
import './lib/PaginationLib.sol';


/// @custom:oz-upgrades-unsafe-allow external-library-linking
/**
* @dev The FAST Access Smart Contract is the source of truth when it comes to
* permissioning and ACLs within a given FAST network.
*/
/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract FastAccess is Initializable, IFastAccess {
  using AddressSetLib for AddressSetLib.Data;

  /// @dev This is where the parent SPC is deployed.
  FastRegistry public reg;

  /// @dev We hold list of governors in here.
  AddressSetLib.Data private governorSet;
  /// @dev We keep the list of members in here.
  AddressSetLib.Data private memberSet;

  /// Events.

  event GovernorAdded(address indexed governor);
  event GovernorRemoved(address indexed governor);
  event MemberAdded(address indexed member);
  event MemberRemoved(address indexed member);

  /// Public stuff.

  /**
  * @dev Designated initializer - replaces the constructor as we are
  * using the proxy pattern allowing for logic upgrades.
  */
  function initialize(FastRegistry _reg, address governor)
      initializer
      external {
    reg = _reg;
    memberSet.add(governor);
    governorSet.add(governor);
  }

  /// Governorship related stuff.

  /**
   * @dev Adds a governor to the governorship list.
   */
  function addGovernor(address _a)
      spcGovernance(msg.sender)
      public override {
    // Add governor to list.
    governorSet.add(_a);
    // Emit!
    emit GovernorAdded(_a);
  }

  /**
   * @dev Removes a governor from the governorship list.
   */
  function removeGovernor(address _a)
      spcGovernance(msg.sender)
      public {
    // Remove governor.
    governorSet.remove(_a);
    // Emit!
    emit GovernorRemoved(_a);
  }

  /**
   * @dev Queries whether a given address is a governor or not.
   */
  function isGovernor(address _a)
      public view override returns(bool) {
    return governorSet.contains(_a);
  }

  /**
   * @dev Queries the number of governors in the governorship list.
   */
  function governorCount()
      external view returns(uint256) {
    return governorSet.values.length;
  }

  /**
   * @dev Returns a page of governors.
   */
  function paginateGovernors(uint256 index, uint256 perPage)
      public view returns(address[] memory, uint256) {
    return PaginationLib.addresses(governorSet.values, index, perPage);
  }

  /// Membership related stuff.

  /**
   * @dev Adds a member to the membership list.
   */
  function addMember(address _a)
      governance(msg.sender)
      public override {
    memberSet.add(_a);
    emit MemberAdded(_a);
  }

  /**
   * @dev Removes a member from the membership list.
   */
  function removeMember(address _a)
      governance(msg.sender)
      public {
    memberSet.remove(_a);
    emit MemberRemoved(_a);
  }

  /**
   * @dev Queries whether a given address is a member or not.
   */
  function isMember(address _a)
      public view override returns(bool) {
    return memberSet.contains(_a);
  }

  /**
   * @dev Queries the number of members in the membership list.
   */
  function memberCount()
      external view returns(uint256) {
    return memberSet.values.length;
  }

  /**
   * @dev Returns a page of members.
   */
  function paginateMembers(uint256 index, uint256 perPage)
      public view returns(address[] memory, uint256) {
    return PaginationLib.addresses(memberSet.values, index, perPage);
  }

  /// Flags.

  /**
   * @dev Retrieves flags for a given address.
   */
  function flags(address _a)
      public view returns(IFastAccess.Flags memory) {
    return
      IFastAccess.Flags({
        isGovernor: isGovernor(_a),
        isMember: isMember(_a)
      });
  }

  // Modifiers.

  modifier spcGovernance(address _a) {
    require(reg.spc().isGovernor(_a), 'Missing SPC governorship');
    _;
  }

  modifier governance(address _a) {
    require(governorSet.contains(_a), 'Missing governorship');
    _;
  }
}
