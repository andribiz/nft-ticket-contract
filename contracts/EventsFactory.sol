// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "./interface/IEvent.sol";
import "./Event.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract EventsFactory is Ownable {
    mapping(address => address[]) public getEvents;
    mapping(address => mapping(address => uint256)) public balances;
    mapping(address => uint256) public totalFee;
    address[] public allEvents;
    address public treasury;
    uint256 public fee;

    event FactoryEventCreated(
        address indexed organizer,
        address indexed events
    );
    event FactoryFeeCollected(address indexed events, uint256 amountFee);

    constructor(uint256 _fee) {
        treasury = msg.sender;
        fee = _fee;
    }

    function allEventsLength() external view returns (uint256) {
        return allEvents.length;
    }

    function createEvent(
        string memory name,
        string memory description,
        string memory ticketSymbol,
        string memory ticketURI,
        address[] memory _payableTokens
    ) public returns (address id) {
        require(_payableTokens.length > 0, "NON_PAYABLE_TOKENS");
        id = address(
            new Event(
                name,
                description,
                ticketSymbol,
                ticketURI,
                msg.sender,
                _payableTokens
            )
        );
        getEvents[msg.sender].push(id);
        allEvents.push(id);
        emit FactoryEventCreated(msg.sender, id);
    }

    function pay(
        address from,
        address token,
        uint256 amount
    ) public payable {
        // require(allEvents[msg.sender] != address(0), "INVALID_EVENT_ID");
        IERC20(token).transferFrom(from, address(this), amount);
        balances[msg.sender][token] += amount;
    }

    function withdraw(
        address to,
        address token,
        uint256 amount
    ) public payable {
        require(balances[msg.sender][token] >= amount, "NOT_ENOUGH_BALANCE");
        balances[msg.sender][token] -= amount;
        IERC20(token).transfer(to, amount);
        // uint256 amountFee = amount * fee;
        // IERC20(token).transfer(to, amount - amountFee);
        // IERC20(token).transfer(treasury, amountFee);
        // totalFee[token] += amountFee;
        // emit FactoryFeeCollected(msg.sender, amountFee);
    }

    function setFee(uint256 _fee) public onlyOwner {
        fee = _fee;
    }
}
