// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import './lib/AddressSetLib.sol';
import './lib/PaginationLib.sol';
import './interfaces/IHasMembers.sol';
import './interfaces/IExchange.sol';
import './interfaces/ISpc.sol';


/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract Exchange is Initializable, IExchange {
  using AddressSetLib for AddressSetLib.Data;

  /// Members.

  ISpc public spc;

  // This is where we hold our members data.
  AddressSetLib.Data private memberSet;

  function initialize(ISpc _spc)
      external initializer {
    spc = _spc;
  }

  /// Membership management.

  function isMember(address candidate)
      external override view returns(bool) {
    return memberSet.contains(candidate);
  }

  function memberCount()
      external override view returns(uint256) {
    return memberSet.values.length;
  }

  function paginateMembers(uint256 cursor, uint256 perPage)
      external override view returns(address[] memory, uint256) {
    return PaginationLib.addresses(memberSet.values, cursor, perPage);
  }

  function addMember(address payable member)
      spcMembership(msg.sender)
      external override {
    // Add the member to our list.
    memberSet.add(member, false);
    // Emit!
    emit IHasMembers.MemberAdded(member);
  }

  function removeMember(address member)
      spcMembership(msg.sender)
      external override {
    // Emit!
    emit IHasMembers.MemberRemoved(member);
  }

  /// Modifiers.

  modifier membership(address a) {
    require(memberSet.contains(a), 'Missing Exchange membership');
    _;
  }

  modifier spcMembership(address a) {
    require(spc.isMember(a), 'Missing SPC membership');
    _;
  }
}
