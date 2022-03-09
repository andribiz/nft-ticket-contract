// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Ticket is ERC721URIStorage {
    uint256 public counter;
    address public ticketOwner;
    string public tokenURI;

    event TicketMinted(address indexed _to, uint256 indexed tokenID);

    mapping(uint256 => bool) public isAttended;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _tokenURI
    ) ERC721(_name, _symbol) {
        ticketOwner = msg.sender;
        counter = 0;
        tokenURI = _tokenURI;
    }

    function mintTicket(address to) public returns (uint256) {
        require(msg.sender == ticketOwner, "MINT_AUTHORIZATION_FAILED");
        require(to != address(0), "ADDRESS_ZERO");
        counter += 1;
        uint256 tokenID = counter;
        _mint(to, tokenID);
        _setTokenURI(tokenID, tokenURI);
        isAttended[tokenID] = false;
        emit TicketMinted(to, tokenID);
        return tokenID;
    }

    function attendTicket(uint256 ticketId) public {
        require(_exists(ticketId), "TICKETID_NOT_FOUND");
        require(
            _isApprovedOrOwner(_msgSender(), ticketId),
            "NOT_OWNER_OR_APPROVED"
        );

        isAttended[ticketId] = true;
    }
}
