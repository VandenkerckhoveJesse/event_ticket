pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ticket is ERC721 {
    struct TicketInfo {
        uint eventId;
        bool redeemed;
    }

    TicketInfo[] public tickets;

    constructor() ERC721("Event Ticket", "TICKET") public {
    }


}
