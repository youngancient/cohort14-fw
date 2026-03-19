// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import {Test} from "forge-std/Test.sol";
import {ERC20Factory} from "../src/ERC20Factory.sol";
import {ERC20} from "../src/ERC20.sol";

contract ERC20FactoryTest is Test {
    ERC20Factory public factory;

    string public constant NAME = "FactoryToken";
    string public constant SYMBOL = "FTK";
    uint8 public constant DECIMALS = 18;

    function setUp() public {
        factory = new ERC20Factory();
    }

    function test_CreateToken() public {
        address tokenAddress = factory.createToken(NAME, SYMBOL, DECIMALS);
        
        assertTrue(tokenAddress != address(0), "Token address should not be zero");
        
        ERC20 token = ERC20(tokenAddress);
        
        assertEq(token.name(), NAME);
        assertEq(token.symbol(), SYMBOL);
        assertEq(token.decimals(), DECIMALS);
    }

    function test_MultipleTokensCanBeCreated() public {
        address token1 = factory.createToken("Token1", "T1", 18);
        
        // Advance time to change the salt
        vm.warp(block.timestamp + 1);
        
        address token2 = factory.createToken("Token2", "T2", 6);
        
        assertTrue(token1 != token2, "Token addresses should be different");
        assertEq(ERC20(token1).name(), "Token1");
        assertEq(ERC20(token2).name(), "Token2");
    }
}
