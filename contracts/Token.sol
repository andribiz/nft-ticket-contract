// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract Token is ERC20Capped, Ownable {
    constructor(
        string memory name,
        string memory symbol,
        uint256 capped
    ) ERC20(name, symbol) ERC20Capped(capped) {}

    function mint(address to, uint256 amount) public onlyOwner {
        ERC20Capped._mint(to, amount);
    }
}
