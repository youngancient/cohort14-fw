// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import {Test} from "forge-std/Test.sol";
import {ERC20} from "../src/ERC20.sol";

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

  function test__TransferFrom() public {
    uint256 approveAmount = 500;
    uint256 transferAmount = 300;

    vm.prank(user1);
    token.approve(user2, approveAmount);

    vm.prank(user2);
    token.transferFrom(user1, user2, transferAmount);

    assertEq(token.balanceOf(user1), STARTING_AMOUNT - transferAmount);
    assertEq(token.balanceOf(user2), transferAmount);
    assertEq(token.allowance(user1, user2), approveAmount - transferAmount);
  }

  function test_RevertWhen_TransferInsufficientBalance() public {
    vm.expectRevert("Insufficient funds");
    vm.prank(user1);
    token.transfer(user2, STARTING_AMOUNT + 1);
  }

  function test_RevertWhen_TransferFromInsufficientAllowance() public {
    uint256 approveAmount = 100;
    
    vm.prank(user1);
    token.approve(user2, approveAmount);

    vm.expectRevert("Insufficient allowance");
    vm.prank(user2);
    token.transferFrom(user1, user2, approveAmount + 1);
  }

  function test_RevertWhen_TransferToZeroAddress() public {
    vm.expectRevert("Can't transfer to address zero");
    vm.prank(user1);
    token.transfer(address(0), 10);
  }

  function test__Mint() public {
    uint256 mintAmount = 500;
    token.mint(user2, mintAmount);
    
    assertEq(token.balanceOf(user2), mintAmount);
    assertEq(token.totalSupply(), STARTING_AMOUNT + mintAmount);
  }

  function test_RevertWhen_ApproveInsufficientBalance() public {
    vm.expectRevert("allowance is greater than your balance");
    vm.prank(user2);
    token.approve(user1, 1);
  }
}