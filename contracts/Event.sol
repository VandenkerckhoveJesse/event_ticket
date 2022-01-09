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
        bool exists;
    }

    mapping(address => uint256[]) internal ownedEvents;

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
        events.push(EventInfo(name, price, totalTickets, totalTickets, msg.sender, true));
        uint id = events.length - 1;
        ownedEvents[msg.sender].push(id);
        return id;
    }

    function purchaseTicket(uint eventId) external payable {
        require(events[eventId].exists, "Event does not exist");
        require(events[eventId].remainingTickets > 0, "No more remaining tickets");
        require(msg.value == events[eventId].price, "Payment does not match price");
        Ticket ticketContract = Ticket(ticketContractAddress);
        uint ticketId = ticketContract.create(msg.sender, eventId);
        events[eventId].remainingTickets  --;
    }

    function redeemTicket(uint eventId, uint ticketId, string memory pass) external onlyEventOwner(eventId){
        require(events[eventId].exists, "The event does not exist");
        Ticket ticketContract = Ticket(ticketContractAddress);
        require(ticketContract.isValid(ticketId, eventId), "Ticket is not valid for this event or has already been redeemed");
        string memory ticketPass = ticketContract.getEncryptedPass(ticketId);
        require(keccak256(bytes(ticketPass)) == keccak256(bytes(pass)), "Encrypted passes do not match up");
        ticketContract.redeem(ticketId);
    }

    function getAllOwnedEvents() external view returns (EventInfo[] memory) {
        uint[] memory ownedEventsSender = ownedEvents[msg.sender];
        uint eventCount = ownedEventsSender.length;
        EventInfo[] memory eventsInfo = new EventInfo[](eventCount);
        for(uint i = 0; i < eventCount; i++) {
            eventsInfo[i] = events[ownedEventsSender[i]];
        }
        return eventsInfo;

    }

    function getAllEvents() external view returns (EventInfo[] memory) {
        return events;
    }
}

