pragma solidity ^0.8.0;

contract Event{
    address public ticketContractAddress;

    struct EventInfo{
        string name;
        uint price;
        uint totalTickets;
        uint remainingTickets;
        address organizer;
    }

    EventInfo[] public events;

    constructor(int ticketAddress) public {
        //ticketContractAddress = ticketAddress;
    }

    function organizeEvent() external returns (uint) {
        return 0;
    }

    function purchaseTicket(uint eventId) external payable returns (uint) {
        return 0;
    }

    function redeemTicket(uint ticketId, uint eventId) external {

    }

}
