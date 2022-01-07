pragma solidity 0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Ticket is ERC721, Ownable{
    address public eventContractAddress;

    struct TicketInfo {
        uint256 eventId;
        bool redeemed;
    }

    //todo eventueel add mappings waar relatie tussen owner en tokens in beide richting worden opgeslaan

    TicketInfo[] public tickets;

    modifier onlyEventContract() {
        require(msg.sender == eventContractAddress);
        _;
    }

    constructor() ERC721("Event Ticket", "TICKET") public {
        eventContractAddress = address(0);
    }

    function setEventAddress(address _eventAddress) external onlyOwner {
        eventContractAddress = _eventAddress;
    }


    function create (address buyer, uint256 eventId) external returns (uint) {
        tickets.push(TicketInfo(eventId, false));
        uint id = tickets.length;
        return id;
    }


}
