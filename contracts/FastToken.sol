// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import './FastRegistry.sol';
import './interfaces/IFastToken.sol';
import './interfaces/IERC20.sol';
import './interfaces/IERC1404.sol';

/// @custom:oz-upgrades-unsafe-allow external-library-linking
contract FastToken is Initializable, IFastToken {
  /// Constants.

  // We use the 0x0 address for all minting operations. A constant
  // to it will always come in handy.
  address constant ZERO_ADDRESS = address(0);

  // Restriction codes.
  uint8 public constant INSUFICIENT_TRANSFER_CREDITS = 1;
  uint8 public constant SENDER_NOT_MEMBER = 2;
  uint8 public constant RECIPIENT_NOT_MEMBER = 3;
  // Restriction messages.
  string public constant INSUFICIENT_TRANSFER_CREDITS_MESSAGE = 'Insuficient transfer credits';
  string public constant SENDER_NOT_MEMBER_MESSAGE = 'Missing sender membership';
  string public constant RECIPIENT_NOT_MEMBER_MESSAGE = 'Missing recipient membership';

  /// Members.

  // This is a pointer to our contracts registry.
  FastRegistry public reg;

  // ERC20 related properties for this FAST Token.
  string public name;
  string public symbol;
  uint256 public decimals;
  uint256 public override totalSupply;

  // Every time a transfer is executed, the credit decreases by the amount
  // of said transfer.
  // It becomes impossible to transact once it reaches zero, and must
  // be provisioned by an SPC governor.
  uint256 public transferCredits;

  // We have to track whether this token has continuous minting or fixed supply.
  bool public hasFixedSupply;

  // Our members balances are held here.
  mapping(address => uint256) public balances;
  // Allowances are stored here.
  mapping(address => mapping(address => uint256)) public allowances;

  /// Public stuff.

  function initialize(FastRegistry _reg,
                      string memory _name,
                      string memory _symbol,
                      uint256 _decimals,
                      bool _hasFixedSupply)
      public initializer {
    // Keep track of the SPC and Access contracts.
    reg = _reg;
    // Set up ERC20 related stuff.
    (name, symbol, decimals, totalSupply) = (_name, _symbol, _decimals, 0);
    // Initialize other internal stuff.
    (transferCredits, hasFixedSupply) = (0, _hasFixedSupply);
  }

  function setHasFixedSupply(bool _hasFixedSupply)
      spcMembership(msg.sender)
      external returns(bool) {
    hasFixedSupply = _hasFixedSupply;
    return true;
  }

  /// Minting methods.

  function mint(uint256 amount, string memory ref)
      spcMembership(msg.sender)
      external returns(bool) {
    // We want to make sure that either of these two is true:
    // - The token doesn't have fixed supply.
    // - The token has fixed supply but has no tokens yet (First and only mint).
    require(!hasFixedSupply || totalSupply == 0, 'Minting not possible at this time');

    // Prepare the minted amount on the zero address, accrue total supply.
    balances[ZERO_ADDRESS] += amount;
    totalSupply += amount;

    // Keep track of the minting operation.
    reg.history().addMintingProof(amount, ref);

    return true;
  }

  /// Tranfer Credit management.

  function addTransferCredits(uint256 _amount)
      spcMembership(msg.sender)
      external returns(bool) {
    transferCredits += _amount;
    return true;
  }

  function drainTransferCredits()
      spcMembership(msg.sender)
      external returns(bool) {
    transferCredits = 0;
    return true;
  }

  /// ERC20 implementation and transfer related methods.

  function balanceOf(address owner)
      external view override returns(uint256) {
    return balances[owner];
  }

  function transfer(address to, uint256 amount)
      public override returns(bool) {
    return transferWithRef(to, amount, 'Unspecified - via ERC20');
  }

  function transferWithRef(address to, uint256 amount, string memory ref)
      public returns(bool) {
    return _transfer(msg.sender, msg.sender, to, amount, ref);
  }

  function allowance(address owner, address spender)
      external view override returns(uint256) {
    // If the allowance being queried is from the zero address and the spender
    // is a governor, we want to make sure that the spender has full rights over it.
    if (owner == ZERO_ADDRESS && reg.access().isGovernor(spender)) {
      return balances[ZERO_ADDRESS];
   } else {
      return allowances[owner][spender];
    }
  }

  function approve(address spender, uint256 amount)
      senderMembership(msg.sender)
      external override returns(bool) {
    // Store allowance...
    allowances[msg.sender][spender] = amount;

    // Emit events.
    emit IERC20.Approval(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address from, address to, uint256 amount)
      public override returns(bool) {
    return transferFromWithRef(from, to, amount, 'Unspecified - via ERC20');
  }

  function transferFromWithRef(address from, address to, uint256 amount, string memory ref)
      requiresTxCredit(amount) senderMembership(from) recipientMembership(to)
      public returns(bool) {
    if (from == ZERO_ADDRESS) {
      require(reg.access().isGovernor(msg.sender), 'Missing governorship');
    } else {
      require(allowances[from][msg.sender] >= amount, 'Insuficient allowance');
      allowances[from][msg.sender] -= amount;
    }
    return _transfer(msg.sender, from, to, amount, ref);
  }

  /// ERC1404 implementation.

  function detectTransferRestriction(address from, address to, uint256 amount)
      external view override returns(uint8) {
    if (transferCredits < amount) {
      return INSUFICIENT_TRANSFER_CREDITS;
    } else if (!reg.access().isMember(from)) {
      return SENDER_NOT_MEMBER;
    } else if (!reg.access().isMember(to)) {
      return RECIPIENT_NOT_MEMBER;
    }
    return 0;
  }

  function messageForTransferRestriction(uint8 restrictionCode)
      pure external override returns(string memory) {
    if (restrictionCode == INSUFICIENT_TRANSFER_CREDITS) {
      return INSUFICIENT_TRANSFER_CREDITS_MESSAGE;
    } else if (restrictionCode == SENDER_NOT_MEMBER) {
      return SENDER_NOT_MEMBER_MESSAGE;
    } else if (restrictionCode == RECIPIENT_NOT_MEMBER) {
      return RECIPIENT_NOT_MEMBER_MESSAGE;
    }
    require(false, 'Unknown restriction code');
    return 'Unknown restriction code.';
  }

  // Private.

  function _transfer(address spender, address from, address to, uint256 amount, string memory ref)
      requiresTxCredit(amount) senderMembership(from) recipientMembership(to)
      internal returns(bool) {
    require(balances[from] >= amount, 'Insuficient funds');

    // Keep track of the transfer.
    reg.history().addTransferProof(spender, from, to, amount, ref);

    // Decrease transfer credits.
    transferCredits -= amount;
    // Keep track of the balances.
    balances[from] -= amount;
    balances[to] += amount;

    // Emit events.
    emit IERC20.Transfer(from, to, amount);
    return true;
  }

  // Modifiers.

  modifier requiresTxCredit(uint256 amount) {
    require(transferCredits >= amount, INSUFICIENT_TRANSFER_CREDITS_MESSAGE);
    _;
  }

  modifier spcMembership(address a) {
    require(reg.spc().isMember(a), 'Missing SPC membership');
    _;
  }

  modifier governance(address a) {
    require(reg.access().isGovernor(a), 'Missing governorship');
    _;
  }

  modifier senderMembership(address a) {
    require(reg.access().isMember(a) || a == ZERO_ADDRESS, SENDER_NOT_MEMBER_MESSAGE);
    _;
  }

  modifier recipientMembership(address a) {
    require(reg.access().isMember(a), RECIPIENT_NOT_MEMBER_MESSAGE);
    _;
  }
}