import Web3 from "web3";
import EventArtifact from "../../build/contracts/Event.json";
import TicketArtifact from "../../build/contracts/Ticket.json"

const App = {
  web3: null,
  account: null,
  eventMeta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = EventArtifact.networks[networkId];
      this.eventMeta = new web3.eth.Contract(
        EventArtifact.abi,
        deployedNetwork.address,
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refreshEvents();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshEvents: async function() {
    const { getAllEvents } = this.eventMeta.methods;
    const events = await getAllEvents().call();
    console.log(events)
    /*const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;*/
  },

  sendCoin: async function() {
    const amount = parseInt(document.getElementById("amount").value);
    const receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    const { sendCoin } = this.eventMeta.methods;
    await sendCoin(receiver, amount).send({ from: this.account });

    this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  },
  createEvent: async function() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const amount = document.getElementById("totalTickets").value;
    document.getElementById("organizeButton").disabled = true

    const {organizeEvent} = this.eventMeta.methods;
    await organizeEvent(name, price, amount).send({from: this.account})

    window.location.href="../"
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live",
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:8545"),
    );
  }

  App.start();
});
