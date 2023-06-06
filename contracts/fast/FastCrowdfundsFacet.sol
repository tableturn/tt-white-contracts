// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import './lib/AFastFacet.sol';
import './FastTopFacet.sol';
import '../lib/LibPaginate.sol';
import '../issuer/IssuerAutomatonsFacet.sol';
import './lib/LibFastCrowdfunds.sol';
import './Crowdfund.sol';


/**
 * @title The Fast Smart Contract.
 * @notice The Fast Crowdfunds facet is in charge of deploying and keeping track of crowdfunds.
 */
contract FastCrowdfundsFacet is AFastFacet {
  using LibAddressSet for LibAddressSet.Data;

  /// @notice Happens when there are insufficient funds somewhere.
  error RequiresPrivilege(address who, uint32 privilege);

  /**
   * @notice Creates a crowdfund contract.
   * @param token is the address of the ERC20 token that should be collected.
   */
  function createCrowdfund(IERC20 token, address beneficiary, uint32 basisPointsFee, string memory ref)
      external {
    address issuer = FastTopFacet(address(this)).issuerAddress();
    // Make sure that the sender has the ISSUER_PRIVILEGE_CROWDFUND_CREATOR trait.
    if (!IssuerAutomatonsFacet(issuer).automatonCan(msg.sender, ISSUER_PRIVILEGE_CROWDFUND_CREATOR))
      revert RequiresPrivilege(msg.sender, ISSUER_PRIVILEGE_CROWDFUND_CREATOR);
    // Deploy a new Crowdfund contract.
    Crowdfund crowdfund = new Crowdfund(
      Crowdfund.Params({
        owner: msg.sender,
        issuer: issuer,
        fast: address(this),
        beneficiary: beneficiary,
        basisPointsFee: basisPointsFee,
        token: token,
        ref: ref
      })
    );
    // Register our newly created crowdfund and keep track of it.
    LibFastCrowdfunds.data().crowdfundSet.add(address(crowdfund), false);
    // Emit!
    emit CrowdfundDeployed(crowdfund);
  }

  /**
   * @notice Removes a CrowdFund contract from this FAST.
   * @param crowdfund the address of the CrowdFund contract to remove.
   */
  function removeCrowdfund(Crowdfund crowdfund)
      public onlyIssuerMember {
    LibFastCrowdfunds.data().crowdfundSet.remove(address(crowdfund), false);
    emit CrowdfundRemoved(crowdfund);
  }

  /**
   * @notice Retrieves the number of crowdfunds ever deployed for this FAST.
   * @return An `uint256` for the count.
   */
  function crowdfundCount()
      external view returns(uint256) {
    return LibFastCrowdfunds.data().crowdfundSet.values.length;
  }

  /**
   * @notice Queries pages of crowdfunds based on a start index and a page size.
   * @param index is the offset at which the pagination operation should start.
   * @param perPage is how many items should be returned.
   * @return An `(address[], uint256)` tuple, which first item is the list of addresses and the second item a cursor to the next page.
   */
  function paginateCrowdfunds(uint256 index, uint256 perPage)
      external view returns(address[] memory, uint256) {
    return LibPaginate.addresses(
      LibFastCrowdfunds.data().crowdfundSet.values,
      index,
      perPage
    );
  }
}
