// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;

import "../interfaces/IERC20.sol";

contract ERC20 is IERC20 {
  mapping(address => uint256) private _balances;
  mapping(address => mapping(address => uint256)) private _allowances;

  uint256 public totalSupply;
  string public name;
  string public symbol;

  constructor(string memory _name, string memory _symbol) {
    name = _name;
    symbol = _symbol;
  }

  function decimals() public pure returns (uint8) {
    return 18;
  }

  function mint(address account, uint256 amount) public {
    require(account != address(0), "ERC20: mint to the zero address");
    totalSupply += amount;
    _balances[account] += amount;
  }

  function burn(address account, uint256 amount) public {
    require(account != address(0), "ERC20: burn from the zero address");
    uint256 accountBalance = _balances[account];
    require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
    _balances[account] = accountBalance - amount;
    totalSupply -= amount;
  }

  function balanceOf(address account) public view override(IERC20) returns (uint256) {
    return _balances[account];
  }

  function transfer(address recipient, uint256 amount) public override(IERC20) returns (bool) {
    _transfer(msg.sender, recipient, amount);
    return true;
  }

  function allowance(address owner, address spender) public view override(IERC20) returns (uint256) {
    return _allowances[owner][spender];
  }

  function approve(address spender, uint256 amount) public override(IERC20) returns (bool) {
    _approve(msg.sender, spender, amount);
    return true;
  }

  function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
    _transfer(sender, recipient, amount);
    uint256 currentAllowance = _allowances[sender][msg.sender];
    require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
    _approve(sender, msg.sender, currentAllowance - amount);
    return true;
  }

  function _transfer(address sender, address recipient, uint256 amount) internal {
    require(sender != address(0), "ERC20: transfer from the zero address");
    require(recipient != address(0), "ERC20: transfer to the zero address");

    uint256 senderBalance = _balances[sender];
    require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
    _balances[sender] = senderBalance - amount;
    _balances[recipient] += amount;
  }

  function _approve(address owner, address spender, uint256 amount) internal {
    require(owner != address(0), "ERC20: approve from the zero address");
    require(spender != address(0), "ERC20: approve to the zero address");
    _allowances[owner][spender] = amount;
  }
}
