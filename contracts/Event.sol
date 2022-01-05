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

    constructor(address ticketAddress) {
        ticketContractAddress = ticketAddress;
    }

}
