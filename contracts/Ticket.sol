pragma solidity 0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ticket is ERC721, Ownable{
    address public eventAddress;

    struct TicketInfo {
        uint256 eventId;
        bool redeemed;
    }

    TicketInfo[] public tickets;

    constructor() ERC721("Event Ticket", "TICKET") public {
        eventAddress = address(0);
    }

    function setEventAddress(address _eventAddress) external onlyOwner {
        eventAddress = _eventAddress;
    }


}
