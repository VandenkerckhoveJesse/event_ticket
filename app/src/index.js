import Web3 from "web3";
import sha256 from 'crypto-js/sha256';
import EventArtifact from "../../build/contracts/Event.json";
import TicketArtifact from "../../build/contracts/Ticket.json";

const App = {
  web3: null,
  account: null,
  eventMeta: null,
  ticketMeta : null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      const deployedEventNetwork = EventArtifact.networks[networkId];
      const deployedTicketNetwork = TicketArtifact.networks[networkId];
      this.eventMeta = new web3.eth.Contract(
        EventArtifact.abi,
        deployedEventNetwork.address,
      );
      this.ticketMeta = new web3.eth.Contract(
          TicketArtifact.abi,
          deployedTicketNetwork.address
      )

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];
      document.getElementById("welcomeAddress").innerHTML = "Welcome " + this.account;
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshEvents: async function() {
    const { getAllEvents } = this.eventMeta.methods;
    const events = await getAllEvents().call();
    const eventsElement = document.querySelector(".events")
    console.log(events)
    eventsElement.innerHTML = "";
    events.forEach((event, i) => {
      const inEth = this.web3.utils.fromWei(event.price, 'ether');
      eventsElement.innerHTML +=
          `<div class="block m-2">
            <h3>${event.name}</h3>
            <ul>
              <li>Price : ${inEth} Eth</li>
              <li>Remaining tickets : ${event.remainingTickets}</li>
              <li>Owner : ${event.owner}</li>
            </ul>
            <button id="buy-${i}" onclick="App.buyTicket(${i}, ${event.price})">buy</button>
          </div>`
      console.log(event)
    })
    /*const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;*/
  },
  refreshTickets: async function() {
    const { getAllOwnedTickets, tokensOfOwner } = this.ticketMeta.methods;
    const { events } = this.eventMeta.methods;
    const ticketIds = await tokensOfOwner(this.account).call({from: this.account})
    const tickets = await getAllOwnedTickets().call({from: this.account});
    const ticketsElement = document.getElementById("tickets")
    console.log(ticketIds);
    ticketsElement.innerHTML = "";
    tickets.forEach(async (ticket, i) => {
      const event = await events(ticket.eventId).call({from: this.account});
      ticketsElement.innerHTML +=
          `<div class="block m-2">
            <h3>${event.name}</h3>
            <p>redeemed : ${ticket.redeemed}</p>
            <a href="/redeem?ticketId=${ticketIds[i]}">redeem</a>
          </div>`
      console.log(event)
    })
    /*const balanceElement = document.getElementsByClassName("balance")[0];
    balanceElement.innerHTML = balance;*/
  },
  refreshOwnEvents: async function(){
    const {getAllOwnedEvents, ownedEvents} = this.eventMeta.methods;
    const events = await getAllOwnedEvents().call({from: this.account});
    const eventIds = await ownedEvents(this.account, 0).call()
    console.log(eventIds)
    const eventsElement = document.querySelector(".events")
    console.log(events);
    eventsElement.innerHTML = "";
    events.forEach(async (event, i) => {
      const inEth = this.web3.utils.fromWei(event.price, 'ether');
      const eventId = await ownedEvents(this.account, i).call()
      eventsElement.innerHTML +=
          `<div class="block m-2">
            <h3>${event.name}</h3>
            <ul>
              <li>Price : ${inEth} Eth</li>
              <li>Remaining tickets : ${event.remainingTickets}</li>
              <li>Owner : ${event.owner}</li>
            </ul>
            <a href="manage/kiosk?eventId=${eventId}">Redeem kiosk</a>
          </div>`
      console.log(event)
    })
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
    const wei = this.web3.utils.toWei(price, 'ether');
    const amount = document.getElementById("totalTickets").value;
    document.getElementById("organizeButton").disabled = true

    const {organizeEvent} = this.eventMeta.methods;
    await organizeEvent(name, wei, amount).send({from: this.account})

    window.location.href="../"
  },
  buyTicket: async function(id, price) {
    var valueAmount = this.web3.utils.toBN(price)
    const { purchaseTicket } = this.eventMeta.methods;
    document.getElementById("buy-"+id).disabled = true;
    await purchaseTicket(id).send({from: this.account, value: valueAmount});
    document.getElementById("buy-"+id).disabled = false;
    this.refreshTickets();
    this.refreshEvents();
  },
  redeemTicket: async function() {
    const { setEncryptedPass } = this.ticketMeta.methods;
    var key = Math.floor(Math.random() * 1000).toString();
    var ticketId = window.location.search.substr(1).toString().split("=")[1]
    var eventCode = document.getElementById("code").value.toString();
    document.getElementById("redeemButton").disabled = true;
    var pass = sha256(eventCode + key).toString();
    await setEncryptedPass(ticketId, pass).send({from: this.account})
    document.getElementById("key").innerHTML = key;
    document.getElementById("ticketId").innerHTML = ticketId;
  },
  validateAndRedeemTicket: async function() {
    const { redeemTicket } = this.eventMeta.methods;
    var code = document.getElementById("random-code").innerHTML.toString();
    var key = document.getElementById("key").value.toString();
    var eventId = window.location.search.substr(1).toString().split("=")[1];
    var ticketId = document.getElementById("ticketId").value
    document.getElementById("redeemButton").disabled = true;
    var pass = sha256(code + key).toString();
    console.log(code + " "+ key)
    console.log(pass)
    try{
      await redeemTicket(eventId, ticketId, pass).send({from: this.account})
      alert("ticket is valid and redeemed!");
      location.reload();
    } catch(e) {
      alert("ticket not valid error: "+e)
      location.reload();
    }

  }


};

window.App = App;

window.addEventListener("load", async function() {
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

  await App.start();
  this.refresh();
});
