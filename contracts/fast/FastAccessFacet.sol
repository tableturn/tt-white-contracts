// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import '../interfaces/IHasMembers.sol';
import '../interfaces/IHasGovernors.sol';
import '../lib/LibAddressSet.sol';
import '../lib/LibPaginate.sol';
import '../marketplace/MarketplaceAccessFacet.sol';
import '../issuer/IssuerAccessFacet.sol';
import './FastTokenFacet.sol';
import './lib/AFastFacet.sol';
import './lib/LibFast.sol';
import './lib/LibFastAccess.sol';
import './FastTopFacet.sol';
import './FastFrontendFacet.sol';


/**
* @notice The FAST Access facet is the source of truth when it comes to
* permissioning and ACLs within a given FAST.
*/
contract FastAccessFacet is AFastFacet, IHasMembers, IHasGovernors {
  using LibAddressSet for LibAddressSet.Data;
  // Structs.

  /**
   * @notice This structure isn't used anywhere in storage. Instead, it
   * allows various methods of the contract to return all the flags
   * associated with a given address in one go.
   */
  struct Flags {
    /// @notice Whether or not the item in scope is considered a governor of this FAST.
    bool isGovernor;
    /// @notice Whether or not the item in scope is considered a member of this FAST.
    bool isMember;
  }

  // Governorship related stuff.

  /// @notice See `IHasGovernors`
  function isGovernor(address candidate)
      external view override returns(bool) {
    return LibFastAccess.data().governorSet.contains(candidate);
  }

  /**
   * @notice Queries the number of governors in the governor list.
   */
  function governorCount()
      external override view returns(uint256) {
    return LibFastAccess.data().governorSet.values.length;
  }

  /**
   * @notice Returns a page of governors.
   */
  function paginateGovernors(uint256 index, uint256 perPage)
      external override view returns(address[] memory, uint256) {
    return LibPaginate.addresses(LibFastAccess.
      data().governorSet.values,
      index,
      perPage
    );
  }

  /**
   * @notice Adds a governor to the governor list.
   */
  function addGovernor(address payable governor)
      external override
      onlyIssuerMember
      onlyMarketplaceMember(governor) {
    // Add governor to list.
    LibFastAccess.data().governorSet.add(governor, false);
    // Notify issuer that this member was added to this FAST.
    IssuerAccessFacet(LibFast.data().issuer).governorAddedToFast(governor);
    // Emit!
    FastFrontendFacet(address(this)).emitDetailsChanged();
    emit GovernorAdded(governor);
  }

  /**
   * @notice Removes a governor from the governor list.
   */
  function removeGovernor(address governor)
      external override
      onlyIssuerMember {
    // Remove governor.
    LibFastAccess.data().governorSet.remove(governor, false);
    // Notify issuer that this member was removed from this FAST.
    IssuerAccessFacet(LibFast.data().issuer).governorRemovedFromFast(governor);
    // Emit!
    FastFrontendFacet(address(this)).emitDetailsChanged();
    emit GovernorRemoved(governor);
  }

  /// Membership related stuff.

  /**
   * @notice Queries whether a given address is a member or not.
   */
  function isMember(address candidate)
      external override view returns(bool) {
    return LibFastAccess.data().memberSet.contains(candidate);
  }

  /**
   * @notice Queries the number of members in the membership list.
   */
  function memberCount()
      external override view returns(uint256) {
    return LibFastAccess.data().memberSet.values.length;
  }

  /**
   * @notice Returns a page of members.
   */
  function paginateMembers(uint256 index, uint256 perPage)
      external override view returns(address[] memory, uint256) {
    return LibPaginate.addresses(
      LibFastAccess.data().memberSet.values,
      index,
      perPage
    );
  }

  /**
   * @notice Adds a member to the membership list.
   */
  function addMember(address payable member)
      external override 
      onlyGovernor(msg.sender) onlyMarketplaceMember(member) {
    // Add the member.
    LibFastAccess.data().memberSet.add(member, false);
    // Notify marketplace that this member was added to this FAST.
    MarketplaceAccessFacet(LibFast.data().marketplace).memberAddedToFast(member);
    // Emit!
    FastFrontendFacet(address(this)).emitDetailsChanged();
    emit MemberAdded(member);
  }

  /**
   * @notice Removes a member from the membership list.
   */
  function removeMember(address member)
      external override 
      onlyGovernor(msg.sender) {
    // Remove member.
    LibFastAccess.data().memberSet.remove(member, false);
    // Notify token facet that this member was removed.
    FastTokenFacet(address(this)).beforeRemovingMember(member);
    // Notify marketplace that this member was removed from this FAST.
    MarketplaceAccessFacet(LibFast.data().marketplace).memberRemovedFromFast(member);
    // Emit!
    FastFrontendFacet(address(this)).emitDetailsChanged();
    emit MemberRemoved(member);
  }

  /// Flags.

  /**
   * @notice Retrieves flags for a given address.
   */
  function flags(address a)
      external view returns(Flags memory) {
    LibFastAccess.Data storage s = LibFastAccess.data();
    return
      Flags({
        isGovernor: s.governorSet.contains(a),
        isMember: s.memberSet.contains(a)
      });
  }
}
