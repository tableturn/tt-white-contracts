// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '../lib/LibAddressSet.sol';
import '../lib/LibPaginate.sol';
import '../spc/SpcTopFacet.sol';
import './lib/LibExchange.sol';
import '../interfaces/IHasMembers.sol';
import './lib/AExchangeFacet.sol';


/** @title The Exchange Smart Contract.
 *  @dev The exchange facet is in charge of keeping track of exchange members and has logic
 *  related to trading.
 *  It requires an SPC contract instance at initialization-time, as it relies on SPC membership
 *  to permission governance functions.
 *  For now, the Exchange contract will only have one facet. Later on, we should split its
 *  business logic into as many facets as we have domains.
 */
contract ExchangeTopFacet is AExchangeFacet, IHasMembers {
  using LibAddressSet for LibAddressSet.Data;

  // Getters.

  function spcAddress()
    external view returns(address) {
      return LibExchange.data().spc;
  }

  // Membership management.

  /** @dev Queries whether a given address is a member of this Exchange or not.
   *  @param candidate is the address to test.
   *  @return A `boolean` flag.
   */
  function isMember(address candidate)
      external override view returns(bool) {
    return LibExchange.data().memberSet.contains(candidate);
  }

  /** @dev Counts the numbers of members present in this Exchange.
   *  @return The number of members in this exchange.
   */
  function memberCount()
      external override view returns(uint256) {
    return LibExchange.data().memberSet.values.length;
  }

  /** @dev Paginates the members of this Exchange based on a starting cursor and a number of records per page.
   *  @param cursor is the index at which to start.
   *  @param perPage is how many records should be returned at most.
   *  @return A `address[]` list of values at most `perPage` big.
   *  @return A `uint256` index to the next page.
   */
  function paginateMembers(uint256 cursor, uint256 perPage)
      external override view returns(address[] memory, uint256) {
    return LibPaginate.addresses(LibExchange.data().memberSet.values, cursor, perPage);
  }

  /** @dev Adds a member to this Exchange member list.
   *  @param member is the address of the member to be added.
   *  @notice Requires that the caller is a member of the linked SPC.
   *  @notice Emits a `IHasMembers.MemberAdded` event.
   */
  function addMember(address payable member)
      external override
      spcMembership(msg.sender) {
    // Add the member to our list.
    LibExchange.data().memberSet.add(member, false);
    // Emit!
    emit IHasMembers.MemberAdded(member);
  }

  /** @dev Removes a member from this Exchange.
   *  @param member is the address of the member to be removed.
   *  @notice Requires that the caller is a member of the linked SPC.
   *  @notice Emits a `IHasMembers.MemberRemoved` event.
   */
  function removeMember(address member)
      external override
      spcMembership(msg.sender) {
    LibExchange.Data storage s = LibExchange.data();
    // Ensure that member doesn't have any FAST membership.
    require(s.fastMemberships[member].values.length == 0, LibConstants.REQUIRES_NO_FAST_MEMBERSHIPS);
    // Remove member.
    s.memberSet.remove(member, false);
    // Emit!
    emit IHasMembers.MemberRemoved(member);
  }

  /** @dev Allows to query FAST memberships for a given member address.
   *  @param member Is the address to check.
   *  @param cursor The index at which to start.
   *  @param perPage How many records should be returned at most.
   */
  function fastMemberships(address member, uint256 cursor, uint256 perPage)
      external view returns(address[] memory, uint256) {
    return LibPaginate.addresses(LibExchange.data().fastMemberships[member].values, cursor, perPage);
  }

  /** @dev Callback from FAST contracts allowing the Exchange contract to keep track of FAST memberships.
   *  @param member The member for which a new FAST membership has been added.
   */
  function memberAddedToFast(address member) 
      external {
    LibExchange.Data storage s = LibExchange.data();
    // Verify that the given address is in fact a registered FAST contract.
    require(SpcTopFacet(s.spc).isFastRegistered(msg.sender), LibConstants.REQUIRES_FAST_CONTRACT_CALLER);
    // Keep track of the member's FAST membership.
    LibAddressSet.Data storage memberFasts = s.fastMemberships[member];
    memberFasts.add(msg.sender, false);
  }

  /** @dev Callback from FAST contracts allowing the Exchange contract to keep track of FAST memberships.
   *  @param member The member for which a FAST membership has been removed.
   */
  function memberRemovedFromFast(address member)
      external {
    LibExchange.Data storage s = LibExchange.data();
    require(SpcTopFacet(s.spc).isFastRegistered(msg.sender), LibConstants.REQUIRES_FAST_CONTRACT_CALLER);
    // Remove the tracked membership.
    LibAddressSet.Data storage memberFasts = s.fastMemberships[member];
    memberFasts.remove(msg.sender, false);
  }
}
