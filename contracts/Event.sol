pragma solidity 0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Event is Ownable{
    address public ticketContractAddress;

    struct EventInfo {
        string name;
        uint price;
        uint totalTickets;
        uint remainingTickets;
        address owner;
    }

    EventInfo[] public events;

    constructor() public{
        ticketContractAddress = address(0);
    }

    function setTicketAddress(address _ticketAddress) external onlyOwner{
        ticketContractAddress = _ticketAddress;
    }

    function organizeEvent(string memory name, uint  price, uint  totalTickets) external returns (uint) {
        events.push(EventInfo(name, price, totalTickets, totalTickets, msg.sender));
        uint id = events.length - 1;
        return id;
    }
}

