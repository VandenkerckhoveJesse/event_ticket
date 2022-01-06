const Event = artifacts.require('Event');
const Ticket = artifacts.require('Ticket')

module.exports = async (deployer) => {
    await deployer.deploy(Event)
    await deployer.deploy(Ticket)
    let eventInstance = await Event.deployed()
    let ticketInstance = await Ticket.deployed();

    console.log("set ticketaddress")
    await eventInstance.setTicketAddress(ticketInstance.address);
    console.log(await eventInstance.ticketAddress())
    //await ticketInstance.updateEventAddress(eventInstance.address);
}