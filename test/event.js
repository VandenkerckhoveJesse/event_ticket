const Event = artifacts.require('Event');
/*
contract("Event", async accounts => {
    let event;
    const ownerAccount = accounts[0];
    beforeEach(async () => {
        event = await Event.new({from: ownerAccount});
    })
    it("should fetch ticket address", async () => {
        const address = await event.ticketContractAddress();
        console.log(address)
        assert.equal(address, '0x0000000000000000000000000000000000000000')
    })
    it("should be able to set ticket address", async () => {
        await event.setTicketAddress(accounts[0])
        const address = await event.ticketContractAddress();
        assert.equal(address, accounts[0])
    })
    it("should not allow non-owner to set ticket address", async() =>{
        try {
            await event.setTicketAddress(accounts[1], {from: accounts[1]})
        } catch (e) {
            assert.equal("Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner -- Reason given: Ownable: caller is not the owner.",
                e.message)
        }
    })
    it("should organize new events", async() => {
        await event.organizeEvent("Koekjes dans", 5, 10, {from: accounts[1]})
        let value = await event.events(0);
        assert.equal(value[0], "Koekjes dans")
    })

})*/