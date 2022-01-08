pragma solidity 0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Ticket.sol";

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

    modifier onlyEventOwner(uint eventId) {
        require(msg.sender == events[eventId].owner);
        _;
    }

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

    function purchaseTicket(uint eventId) external payable returns (uint) {
        require(events[eventId].owner != address(0), "Event does not exist");
        require(events[eventId].remainingTickets > 0, "No more remaining tickets");
        require(msg.value == events[eventId].price, "Payment does not match price");
        Ticket ticketContract = Ticket(ticketContractAddress);
        uint ticketId = ticketContract.create(msg.sender, eventId);
        events[eventId].remainingTickets  --;
        return ticketId;
    }

    function redeemTicket(uint eventId, uint ticketId, string pass) external onlyEventOwner(eventId) {
        Ticket ticketContract = Ticket(ticketContractAddress);
        require(ticketContract.tickets[ticketId].eventId == eventId, "Ticket is not for this event");
        string memory ticketPass = ticketContract.getEncryptedPass(ticketId);
        require(ticketPass == pass, "Encrypted passes do not match up");
        ticketContract.redeem();
    }
}

