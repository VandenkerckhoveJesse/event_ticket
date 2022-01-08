pragma solidity 0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract Ticket is ERC721Enumerable, Ownable{
    address public eventContractAddress;



    struct TicketInfo {
        uint256 eventId;
        bool redeemed;
        string encryptedPass;
    }


    //todo eventueel add mappings waar relatie tussen owner en tokens in beide richting worden opgeslaan

    TicketInfo[] public tickets;

    modifier onlyEventContract() {
        require(msg.sender == eventContractAddress);
        _;
    }

    modifier onlyTicketOwner(uint id) {
        require(msg.sender == ownerOf(id));
        _;
    }

    constructor() ERC721("Event Ticket", "TICKET") public {
        eventContractAddress = address(0);
    }

    function setEventAddress(address _eventAddress) external onlyOwner {
        eventContractAddress = _eventAddress;
    }


    function create (address buyer, uint256 eventId) external returns (uint) {
        tickets.push(TicketInfo(eventId, false, ""));
        uint id = tickets.length - 1;
        _mint(buyer, id);
        return id;
    }

    function tokensOfOwner(address _owner) external view returns (uint[] memory) {
        uint tokenCount = balanceOf(_owner);
        uint[] memory tokensId = new uint256[](tokenCount);
        for(uint i = 0; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokensId;
    }

    function setEncryptedPass(uint ticketId, string memory pass) onlyTicketOwner(ticketId) external {
        tickets[ticketId].encryptedPass = pass;
    }

    function getEncryptedPass(uint ticketId) external  view returns (string memory) {
        string memory pass = tickets[ticketId].encryptedPass;
        return pass;
    }

    function redeem(uint ticketId) external onlyEventContract {
        tickets[ticketId].redeemed = true;
    }


}
