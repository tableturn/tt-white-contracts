// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import '../interfaces/IERC20.sol';
import '../lib/LibAddressSet.sol';
import '../lib/LibPaginate.sol';
import '../common/AHasMembers.sol';
import '../common/AHasAutomatons.sol';
import '../interfaces/ICustomErrors.sol';


/**
 * @title The `Distribution` FAST contract.
 * @notice This contract allows for dividends or proceeds to be distributted amongst
 * a list of beneficiaries. It has a lifecycle that can be described based on the
 * following steps (or phases):
 * - Funding, during which the sum to be distributed has to be credited to this contract.
 * - FeeSetup, during which the oracle will define the fee to be paid upon distribution.
 * - BeneficiariesSetup, during which the oracle can setup the beneficiaries.
 * - Withdrawal, during which each beneficiary can withdraw their proceeds.
 * - Terminated, during which nothing is possible.
 */
contract Distribution {
  using LibAddressSet for LibAddressSet.Data;

  /// @notice The possible phases in which the contract is in.
  enum Phase { Creation, FeeSetup, BeneficiariesSetup, Withdrawal, Terminated }

  /**
   * @notice Emited whenever the internal phase of this distribution changes.
   * @param phase The new phase of this contract.
   */
  event Advance(Phase phase);
  /**
   * @notice Emited whenever a beneficiary is added to the distribution list.
   * @param beneficiary is the address of the beneficiary who was added.
   * @param amount is the amount in native target token that is owed to the beneficiary. 
   */
  event BeneficiaryAdded(address indexed beneficiary, uint256 indexed amount);
  /**
   * @notice Emited whenever a beneficiary is removed from the distribution list.
   * @param beneficiary is the address of the beneficiary who was removed.
   */
  event BeneficiaryRemoved(address indexed beneficiary);
  /**
   * @notice Emited whenever a beneficiary withdraws their owings.
   * @param caller is the address who ordered the withdrawal.
   * @param beneficiary is the address of the beneficiary who performed the withdrawal.
   * @param amount is the amount that was withdrawn.
   */
  event Withdrawal(address indexed caller, address indexed beneficiary, uint256 amount);

  /// @notice Parameters to be passed to this contract's constructor.
  struct Params {
    /// @notice The distributor of the distribution - eg the address who ordered its deployment.
    address distributor;
    /// @notice The Issuer contract address.
    address issuer;
    /// @notice To which FAST this Distribution belongs
    address fast;
    /// @notice The target ERC20 address to be distributed to the beneficiaries.
    IERC20 token;
    /// @notice Block latching.
    uint256 blockLatch;
    /// @notice How much is meant to be distributed.
    uint256 total;
  }

  /// @notice A version identifier for us to track what's deployed.
  uint16 public constant VERSION = 1;
  /// @notice The initial params, as passed to the contract's constructor.
  Params public params;

  /// @notice The phase at which the distribution is at.
  Phase public phase = Phase.Creation;
  /// @notice When was the distribution created.
  uint256 public creationBlock;
  /// @notice How much the fee that will be distributed to `issuer` is.
  uint256 public fee;
  /// @notice How much is left for distribution.
  uint256 public available;

  /// @notice The list of beneficiaries known to the system.
  LibAddressSet.Data internal beneficiaries;
  /// @notice How much was set asside for a particular beneficiary.
  mapping(address => uint256) public owings;
  /// @notice Whether or not a benificiary has withdrawn yet.
  mapping(address => bool) public withdrawn;

  /**
   * @notice Constructs a new `Distribution` contracts.
   * @param p is a `Params` structure.
   */
  constructor(Params memory p) {
    // If the distribution is latched in the future, throw.
    if (p.blockLatch >= block.number)
      revert ICustomErrors.UnsupportedOperation();
    // Store all parameters.
    params = p;
    available = p.total;
    creationBlock = block.number;

    // We are in the funding phase. Let's check that this contract is allowed to spend
    // on behalf of the distributor. Note that only the distributor can call this function.
    // Note that this transition requires that the caller is the distributor of the distribution.

    // Make sure that the current distribution has exactly the required amount locked.
    uint256 balance = params.token.balanceOf(address(this));
    if (balance != params.total)
      revert ICustomErrors.InsufficientFunds(params.total - balance);
    // Move to next phase.
    emit Advance(phase = Phase.FeeSetup);
  }

  /** 
   * @notice Advances to the next phase when possible, reverts otherwise.
   * Note that since this method calls the `token` contract, it **must be
   * protected against reentrancy**.
   */
  function advance()
      public {
    // If we are still in the BeneficiariesSetup phase, progress to Withdrawal phase.
    // Note that only managers should be allowed to move from the BeneficiariesSetup phase.
    if (phase == Phase.BeneficiariesSetup) {
      requireManagerCaller();
      // If the distribution covers more than the sum of all proceeds, we want
      // to prevent the distribution from advancing to the withdrawal phase.
      if (available > 0)
        revert ICustomErrors.UnsupportedOperation();
      // Transfer the fee to the issuer contract.
      require(params.token.transfer(params.issuer, fee));
      // Move to next phase.
      emit Advance(phase = Phase.Withdrawal);
    }
    // Any transition other than the ones specified here are not to be made using
    // the `advance` method. For example, Moving manually from the fee setup phase
    // isn't supported, the way to do this is to use the `setFee` method.
    else
      revert ICustomErrors.UnsupportedOperation();
  }

  /**
   * @notice Sets the fee to be taken upon distribution. Only available during the
   * `Phase.FeeSetup` phase, throws otherwise. This method automatically advances the
   * phase to `Phase.BeneficiariesSetup`, so it can only be called once.
   * Note that only a manager (issuer or automaton with the correct privileges) can
   * call this method.
   * @param _fee is the amount that the `issuer` will receive.
   */
  function setFee(uint256 _fee)
      external onlyDuring(Phase.FeeSetup) onlyManager {
    fee = _fee;
    available -= fee;
    // Move to next phase.
    emit Advance(phase = Phase.BeneficiariesSetup);
  }

  /**
   * @notice Adds beneficiaries and amounts to the distribution list. Both `_beneficiaries`
   * and `_amounts` arrays must be of the same size, or the method will revert.
   * This method is only available during the `Phase.BeneficiariesSetup` phase.
   * During execution, this method will make sure that the cumulated amounts for all
   * beneficiaries doesn't exceed the `total` amount available for distribution, or it
   * will simply throw.
   * Note that adding the same beneficiary twice will throw.
   * Note that only a manager (issuer or automaton with the correct privileges) can
   * call this method.
   * @param _beneficiaries is the list of beneficiaries to add.
   * @param _amounts is the list of amounts respective to each beneficiary.
   */
  function addBeneficiaries(address[] calldata _beneficiaries, uint256[] calldata _amounts)
      public onlyDuring(Phase.BeneficiariesSetup) onlyManager {
    // Beneficiaries and amount sizes must match.
    if (_beneficiaries.length != _amounts.length)
      revert ICustomErrors.UnsupportedOperation();

    // We will count how much is needed for all these beneficiaries.
    uint256 needed = 0;
    // For each of the passed beneficiaries...
    for (uint256 i = 0; i < _beneficiaries.length;) {
      // Memoize a few variables...
      address beneficiary = _beneficiaries[i];
      uint256 amount = _amounts[i];
      // Make sure the beneficiary is a member of the FAST.
      if (!AHasMembers(params.fast).isMember(beneficiary))
        revert ICustomErrors.RequiresFastMembership(beneficiary);

      // Add the beneficiary to our set.
      beneficiaries.add(beneficiary, false);
      // Keep track of the amount this beneficiary is entitled to.
      owings[beneficiary] = amount;
      // Accumulate how much is needed for these beneficiaries.
      needed += amount;
      // Emit!
      emit BeneficiaryAdded(beneficiary, amount);
      // Next iteration.
      unchecked { ++i; }
    }

    // Make sure that there's enough to pay everyone.
    if (available < needed)
      revert ICustomErrors.InsufficientFunds(needed - available);
    // Decrease the amount of available funds.
    unchecked { available -= needed; }
  }

  /**
   * @notice Removes a list of beneficiaries from the distribution list.
   * Note that removing a non-existent beneficiary will simply throw.
   * During execution, this method will increase the amount available for
   * distribution automatically.
   * Note that only a manager (issuer or automaton with the correct privileges) can
   * call this method.
   * @param _beneficiaries is the list of addresses to remove.
   */
  function removeBeneficiaries(address[] memory _beneficiaries)
      external onlyDuring(Phase.BeneficiariesSetup) onlyManager {
    // Remove all specified beneficiaries.
    for (uint256 i = 0; i < _beneficiaries.length;) {
      address beneficiary = _beneficiaries[i];
      // Remove the beneficiary from our list.
      beneficiaries.remove(beneficiary, false);
      // Increase the amount available for distribution, as it won't go to this beneficiary.
      available += owings[beneficiary];
      // Set the beneficiary's balance to zero.
      owings[beneficiary] = 0;
      // Emit!
      emit BeneficiaryRemoved(beneficiary);
      // Next iteration.
      unchecked { ++i; }
    }
  }

  /**
   * @notice Queries pages of beneficiaries based on a start index and a page size.
   * Note that it is possible to query owings for each of these beneficiaries by
   * utilizing the `owings` and `withdrawn` public function.
   * @param index is the offset at which the pagination operation should start.
   * @param perPage is how many items should be returned.
   * @return A `(address[], uint256)` tuple, which first item is the list of addresses and the second item a cursor to the next page.
   */
  function paginateBeneficiaries(uint256 index, uint256 perPage)
      external view returns(address[] memory, uint256) {
    return LibPaginate.addresses(
      beneficiaries.values,
      index,
      perPage
    );
  }

  /**
   * @notice This function allows any beneficiary to withdraw what they are owed. This
   * method can only be called during the `Phase.Withdrawal` phase.
   * Note that this function is protected from reentrancy as it operates on the `token`
   * methods.
   */
  function withdraw(address beneficiary)
      public onlyDuring(Phase.Withdrawal) {
    if (withdrawn[beneficiary])
      revert ICustomErrors.DuplicateEntry();
    else if (!beneficiaries.contains(beneficiary))
      revert ICustomErrors.NonExistentEntry();
    // Memoize a few variables.
    uint256 amount = owings[beneficiary];
    // Make sure they can't do it again later... It is important
    // to do this before any call to `token` to prevent reentrancy.
    withdrawn[beneficiary] = true;
    // Transfer to the beneficiary all of their ownings.
    require(params.token.transfer(beneficiary, amount));
    // Emit!
    emit Withdrawal(msg.sender, beneficiary, amount);
  }

  // TODO: Only allow the termination after a certain number of blocks have ellapsed.
  /**
   * @notice A panic function that can only be called by the distributor of the distribution.
   * Upon calling this method, the contract will simply send back any funds still
   * available to it and set its internal state to a termination one.
   * Note that since this method calls the `token` contract, it **must be
   * protected against reentrancy**.
   */
  function terminate()
      public onlyManager {
    // Reset internal variables so that it's clear that the contract is terminated.
    // It is important to do this prior to any call to `token` methods to prevent
    // re-entrancy attacks.
    emit Advance(phase = Phase.Terminated);
    available = 0;

    // Move all funds to the distributor account.
    params.token.transfer(params.distributor, params.token.balanceOf(address(this)));
  }

  // Modifiers

  function requireManagerCaller()
      internal view {
    if (!AHasMembers(params.issuer).isMember(msg.sender) && !AHasAutomatons(params.fast).isAutomaton(msg.sender))
      revert ICustomErrors.RequiresIssuerMembership(msg.sender);
  }

  function requireDistributor()
      internal view {
    require(msg.sender == params.distributor, "Distributorship needed.");
  }

  modifier onlyManager() {
    requireManagerCaller();
    _;
  }

  modifier onlyDuring(Phase _phase) {
    if (_phase != phase)
      revert ICustomErrors.UnsupportedOperation();
    _;
  }
}
