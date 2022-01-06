pragma solidity 0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";

contract Event is Ownable{
    address public ticketAddress;

    struct EventInfo {
        string name;
        uint price;
        uint totalTickets;
        uint remainingTickets;
        address owner;
    }

    EventInfo[] public events;

    constructor() public{
        ticketAddress = address(0);
    }

    function setTicketAddress(address _ticketAddress) external onlyOwner{
        ticketAddress = _ticketAddress;
    }

    //function organizeEvent(string name, uint  price, uint  totalTickets) external returns (uint) {
    //    uint id = events.push(EventInfo(name, price, totalTickets, msg.sender)) - 1;
    //    return id;
    //}
}

