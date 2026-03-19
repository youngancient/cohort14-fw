// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import {ERC20} from "./ERC20.sol";

contract ERC20Factory {
    function createToken(string memory _name, string memory _symbol, uint8 _decimals) external returns (address) {
        return address(new ERC20{salt: bytes32(abi.encode(address(this), block.timestamp))}(_name, _symbol, _decimals));
    }
}
