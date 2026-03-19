// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "src/ERC20.sol";

contract ERC20Test is Test {
  ERC20 token;
  string public constant NAME = "Test";
  string public constant SYMBOL = "TST";
  uint8 public constant DECIMAL = 18;


  function setUp() public {
    token = new ERC20(NAME, SYMBOL, DECIMAL);
  }

  function testInitialParametersAreSet() public {
    assertEq(token.name(), NAME);
    assertEq(token.symbol(), SYMBOL);
    assertEq(token.decimals(), DECIMAL);
    assert(token.totalSupply() == 0);
  }
}