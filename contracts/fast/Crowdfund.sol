// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import '../lib/LibAddressSet.sol';
import '../interfaces/IERC20.sol';
import '../common/AHasMembers.sol';
import '../common/AHasAutomatons.sol';
import './FastAutomatonsFacet.sol';
import '@openzeppelin/contracts/utils/math/Math.sol';


/**
 * @title The `Crowdfund` FAST contract.
 * @notice This contract is used to manage a crowdfunding campaign.
 */
contract Crowdfund {
  using LibAddressSet for LibAddressSet.Data;

  error UnsupportedOperation();
  error InconsistentParameters();

  error RequiresFastMembership(address who);
  error RequiresManagerCaller();
  error TokenContractError();

  error InsufficientFunds(uint256 amount);

  /**
   * @notice Emited whenever the internal phase of this crowdfund changes.
   * @param phase The new phase of this contract.
   */
  event Advance(Phase phase);

  /**
   * @notice Emited whenever a plege is made.
   * @param pledger The address of the pledger.
   * @param amount The amount of tokens pledged.
   */
  event Pledge(address indexed pledger, uint256 amount);

  /**
   * @notice Emited when the crowdfunding is terminated.
   * @param success Whether the crowdfunding was successful or not.
   */
  event Terminated(bool indexed success);

  /// @notice The different phases of the crowdfund.
  enum Phase { Setup, Funding, Success, Failure }

  /// @notice Parameters to be passed to this contract's constructor.
  struct Params {
    /// @notice Who initially deployed this contract.
    address owner;
    /// @notice The issuer contract address.
    address issuer;
    /// @notice The FAST contract that this crowdfund is locked onto.
    address fast;
    /// @notice The beneficiary of the crowdfund.
    address beneficiary;
    /// @notice The token contract address.
    IERC20 token;
  }

  /// @notice A version identifier for us to track what's deployed.
  uint16 public constant VERSION = 1;

  /// @notice The initial params, as passed to the contract's constructor.
  Params public params;
  /// @notice The phase at which the crowdfunding is at.
  Phase public phase;
  /// @notice When was the distribution created.
  uint256 public creationBlock;
  /// @notice The fee expressed in basis points - eg ten thousandths.
  uint256 public basisPointsFee;
  /// @notice How much was collected so far.
  uint256 public collected;

  /// @notice The set of addresses that have pledged to this crowdfund.
  LibAddressSet.Data internal pledgers;
  /// @notice The mapping of pledgers to their pledged amounts.
  mapping(address => uint256) public pledges;

  /**
   * @notice The constructor for this contract.
   * @param p The parameters to be passed to this contract's constructor.
   */
  constructor(Params memory p) {
    // Store parameters.
    params = p;
    // Check that the owner is a member of the FAST contract.
    if (!isFastMember(p.owner))
      revert RequiresFastMembership(p.owner);
    // Check that the beneficiary is a member of the FAST contract.
    else if (!isFastMember(p.beneficiary))
      revert RequiresFastMembership(p.beneficiary);
  }

  /**
   * @notice Advances the campaign to the funding phase.
   * @param _basisPointsFee The fee expressed in basis points - eg ten thousandths.
   */
  function advanceToFunding(uint256 _basisPointsFee)
      external onlyManager {
    // Make sure the fee doesn't exceed a hundred percent.
    if (_basisPointsFee > 10_000)
      revert InconsistentParameters();
    basisPointsFee = _basisPointsFee;
    emit Advance(phase = Phase.Funding);
  }

  /**
   * @notice Allows a pledger to pledge tokens to this crowdfund.
   * @param amount The amount of tokens to pledge.
   */
  function pledge(uint256 amount)
      public onlyDuring(Phase.Funding) onlyFastMember {
    // Make sure the amount is non-zero.
    if (amount == 0)
      revert InconsistentParameters();
    // Make sure that the message sender gave us allowance for at least this amount.
    if (params.token.allowance(msg.sender, address(this)) < amount)
      revert InsufficientFunds(amount);
    // Keep track of the pledger - don't throw if already present.
    pledgers.add(msg.sender, true);
    // Add the pledged amount to the existing pledge.
    pledges[msg.sender] += amount;
    // Update the collected amount.
    collected += amount;
    // Transfer the tokens to this contract.
    if (!params.token.transferFrom(msg.sender, address(this), amount))
      revert TokenContractError();
    // Emit!
    emit Pledge(msg.sender, amount);
  }

  /**
   * @notice Allows an issuer member to terminate the crowdfunding given a success flag.
   * @param success Whether the crowdfunding was successful or not.
   */
  function terminate(bool success)
      public onlyDuring(Phase.Funding) onlyManager {
    // If the crowdfunding was successful...
    if (success) {
      // Transfer the fee to the issuer contract if there is one.
      uint256 finalFee = feeAmount();
      if (finalFee > 0)
        if (!params.token.transfer(params.issuer, finalFee))
          revert TokenContractError();
      // Transfer the payout to the beneficiary.
      uint256 payout = collected - finalFee;
      if (payout > 0)
        if (!params.token.transfer(params.beneficiary, payout))
          revert TokenContractError();
    }
    // Advance to next phase.
    emit Advance(phase = success ? Phase.Success : Phase.Failure);
  }

  /**
   * @notice Allows a pledger to withdraw their funds if the crowdfunding failed.
   * @param pledger The address of the pledger to withdraw funds for.
   */
  function withdraw(address pledger)
      public onlyDuring(Phase.Failure) {
    // Make sure the pledger is in the set.
    if (!pledgers.contains(pledger))
      revert UnsupportedOperation();
    // Store the amount of the pledger's pledge.
    uint256 amount = pledges[pledger];
    // Track that the pledger has withdrawn their funds.
    pledges[pledger] = 0;
    // Transfer the tokens to the pledger.
    if (amount > 0)
      if (!params.token.transfer(pledger, amount))
        revert TokenContractError();
  }

  /// @dev Given a total and a fee in basis points, returns the fee amount rounded up.
  function feeAmount()
      public view returns(uint256) {
    return Math.mulDiv(collected, basisPointsFee, 10_000, Math.Rounding.Up);
  }

  /// Modifiers and ACL functions.

  function isFastMember(address who)
      internal view returns(bool) {
    return AHasMembers(params.fast).isMember(who);
  }

  modifier onlyDuring(Phase _phase) {
    if (_phase != phase)
      revert UnsupportedOperation();
    _;
  }

  modifier onlyFastMember() {
    if (!isFastMember(msg.sender))
      revert RequiresFastMembership(msg.sender);
    _;
  }

  modifier onlyManager() {
    if (!AHasMembers(params.issuer).isMember(msg.sender) &&
        !AHasAutomatons(params.fast).automatonCan(msg.sender, FAST_PRIVILEGE_MANAGE_DISTRIBUTIONS))
      revert RequiresManagerCaller();
    _;
  }
}
