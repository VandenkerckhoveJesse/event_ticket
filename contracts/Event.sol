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

    function organizeEvent() returns (uint) {
        return 0;
    }

    function purchaseTicket(uint eventId) payable returns (uint) {
        return 0;
    }

    function redeemTicket(uint ticketId, uint eventId) {

    }

}
