const Ticket = artifacts.require('Ticket');
const Event = artifacts.require('Event');

contract("Test relationship", async accounts => {
    let ticket;
    let event;
    const ownerAccount = accounts[0];
    const organizerAccount = accounts[1];
    const ticketAccount = accounts[2];


    beforeEach(async () => {
        event = await Event.deployed();
        ticket = await Ticket.deployed();
    })

    it("should allow organizer to organize event", async () => {
        await event.organizeEvent("Big event", 2, 5, {from: organizerAccount})
        let value = await event.events(0);
        assert.equal(value[4], organizerAccount)
    })

    it("should allow ticketholder to purchase ticket", async () => {
        let ticketId = await event.purchaseTicket(0, {from: ticketAccount, value: 2});
        let value = await ticket.tickets(0);
        assert.equal(0, value[0])
    })

    it("should show the previous ticket as owned by ticketholder", async () => {
        assert.equal(await ticket.ownerOf(0), ticketAccount)
        assert.equal(await ticket.balanceOf(ticketAccount), 1)
    })

    it("should return al owned tickets from ticketowner", async () => {
        await event.purchaseTicket(0, {from: ticketAccount, value: 2});
        let result = await ticket.tokensOfOwner(ticketAccount);
        assert.equal(result[0], 0);
        assert.equal(result[1], 1);
    })

    it("should set and return the encrypted passcode", async () => {
        await ticket.setEventAddress(ownerAccount, {from:ownerAccount});
        await ticket.setEncryptedPass(0, "secret", {from: ticketAccount});
        let result = await ticket.getEncryptedPass(0, {from: ownerAccount});
        await ticket.setEventAddress(event.address, {from:ownerAccount});
        assert.equal(result, "secret")
    })
    it("should not let anyone else set the encrypted pass", async () => {
        try{
            await ticket.setEncryptedPass(0, "secret", {from: ownerAccount});
        }catch (e) {
            assert(e, e);
        }

    })
    it("should not anyone else read the encrypted pass", async () => {
        try {
            await ticket.getEncryptedPass(0, {from: organizerAccount});
        } catch (e) {
            assert(e, e);
        }
    })

    it("should redeem the ticket", async () => {
        awai
    })



})