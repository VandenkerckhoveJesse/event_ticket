const Event = artifacts.require('Event');
const Ticket = artifacts.require('Ticket')

module.exports = async (deployer) => {
    await deployer.deploy(Event)
    await deployer.deploy(Ticket)
    let eventInstance = await Event.deployed()
    let ticketInstance = await Ticket.deployed();


    await eventInstance.setTicketAddress(ticketInstance.address);
    await ticketInstance.setEventAddress(eventInstance.address);
}