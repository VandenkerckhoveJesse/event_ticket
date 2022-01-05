pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ticket is ERC721 {
    address public eventContractAddress;

    struct TicketInfo {
        uint eventId;
        bool redeemed;
    }

    TicketInfo[] public tickets;

    constructor() ERC721("Event Ticket", "TICKET") public {
    }

    function isValid() public view returns (bool){
        return true;
    }

    function isRedeemable() public view returns (bool) {
        return true;
    }


    //todo protect this function, not everyone can just redeem any ticket (the organizer and ticketholder have to both agree)
    function redeemTicket(uint ticketId, uint eventId) external {

    }

    //again protect this, only the event contract may create new tickets.
    function createTicket(address buyer, uint eventId) external returns (uint256) {
        return 1;
    }


}
