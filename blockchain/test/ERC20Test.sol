// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "src/ERC20.sol";

contract ERC20Test is Test {
  ERC20 token;
  address user1 = makeAddr("user1");
  address user2 = makeAddr("user2");

  string public constant NAME = "Test";
  string public constant SYMBOL = "TST";
  uint8 public constant DECIMAL = 18;
  uint256 public constant STARTING_AMOUNT = 1000;

  function setUp() public {
    token = new ERC20(NAME, SYMBOL, DECIMAL);

    vm.prank(user1);
    token.mint(user1, STARTING_AMOUNT);
  }

  function test__InitialParametersAreSet() public view {
    assertEq(token.name(), NAME);
    assertEq(token.symbol(), SYMBOL);
    assertEq(token.decimals(), DECIMAL);
    assert(token.totalSupply() == STARTING_AMOUNT);
    assert(token.balanceOf(user1) == STARTING_AMOUNT);
  }

  function test__Transfer() public {
    vm.prank(user1);
    token.transfer(user2, STARTING_AMOUNT);

    uint256 user1AfterBalance = token.balanceOf(user1);
    uint256 user2AfterBalance = token.balanceOf(user2);

    assert(user1AfterBalance == 0);
    assert(user2AfterBalance == STARTING_AMOUNT);
  
  }

  function test__Approve() public {
    uint256 approveAmount = 500;
    
    vm.prank(user1);
    token.approve(user2, approveAmount);

    assertEq(token.allowance(user1, user2), approveAmount);
  }
}