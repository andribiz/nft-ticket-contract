// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./EventsFactory.sol";
import "./Ticket.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Event is ReentrancyGuard {
    address public organizer;

    address public factory;
    address[] public payableToken;

    string public name;
    string public description;
    address public ticket;

    uint256 public price;

    event EventTicketPurchased(
        address indexed customer,
        uint256 amountTicket,
        uint256 total
    );
    event EventFundWithdraw(
        address indexed eventID,
        address token,
        uint256 amount
    );

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "AUTH_ERROR");
        _;
    }

    constructor(
        string memory _name,
        string memory _description,
        string memory _ticketSymbol,
        string memory _tokenURI,
        address _organizer,
        address[] memory _tokens
    ) {
        factory = msg.sender;
        organizer = _organizer;
        payableToken = _tokens;
        name = _name;
        description = _description;
        ticket = address(new Ticket(name, _ticketSymbol, _tokenURI));
    }

    function buy(
        address to,
        address token,
        uint256 amount
    ) public payable nonReentrant {
        require(to != address(0), "NO_ADDRESS");
        require(amount > 0, "AMOUNT_INVALID");
        //NEED TO CHECK TOKEN OPTION PAYMENT VALID
        uint256 total = amount * price;
        EventsFactory(factory).pay(to, token, total);
        for (uint256 i = 0; i < amount; i++) {
            Ticket(ticket).mintTicket(to);
        }
        emit EventTicketPurchased(to, amount, total);
    }

    function withdraw(address token, uint256 amount) public onlyOrganizer {
        EventsFactory(factory).withdraw(organizer, token, amount);
        emit EventFundWithdraw(address(this), token, amount);
    }

    function setPrice(uint256 _price) public onlyOrganizer {
        price = _price;
    }
}
