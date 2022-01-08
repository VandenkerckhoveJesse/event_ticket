const Ticket = artifacts.require('Ticket');

contract("Ticket", async accounts => {
    let ticket;
    const ownerAccount = accounts[0];
    beforeEach(async () => {
        ticket = await Ticket.new({from: ownerAccount})
        await ticket.setEventAddress(accounts[0])
    })
    it("should fetch ticket address", async () => {
        const address = await ticket.eventContractAddress();
        console.log(address)
        assert.equal(address, ownerAccount)
    })
    it("should be able to set event address", async () => {
        await ticket.setEventAddress(accounts[0]);
        const address = await ticket.eventContractAddress();
        assert.equal(address, accounts[0])
    })
    it("should not allow non-owner to set event address", async() => {
        try {
            await ticket.setEventAddress(accounts[1], {from: accounts[1]})
        } catch (e) {
            assert.equal("Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.",
                e.message)
        }
    })
    it("should be able to create new ticket", async() => {
        await ticket.setEventAddress(ownerAccount)
        await ticket.create(ownerAccount, 2)
        let value = await ticket.tickets(0);
        assert.equal(value[0], 2);
    })

    it("should validate ticket", async() => {
        await ticket.create(ownerAccount, 2);
        assert.equal(await ticket.isValid(0, 2), true)
    })

    it("should not validate wrong ticket", async() => {
        await ticket.create(ownerAccount, 2);
        assert.equal(await ticket.isValid(0, 1), false)
    })

    it("should not validate non existing tickets", async() => {
        try {
            assert.equal(await ticket.isValid(0, 0), false)
        } catch (e) {
            console.log(e)
        }

    })

    it("should show all ticket data", async () => {
        await ticket.create(ownerAccount, 2);
        console.log(await ticket.getTicketInfo(0));
    })

})