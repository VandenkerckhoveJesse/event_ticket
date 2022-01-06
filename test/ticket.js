const Ticket = artifacts.require('Ticket');

contract("Ticket", async accounts => {
    let ticket;
    const ownerAccount = accounts[0];
    beforeEach(async () => {
        ticket = await Ticket.new({from: ownerAccount})
    })
    it("should fetch ticket address", async () => {
        const address = await ticket.eventAddress();
        console.log(address)
        assert.equal(address, '0x0000000000000000000000000000000000000000')
    })
    it("should be able to set event address", async () => {
        await ticket.setEventAddress(accounts[0]);
        const address = await ticket.eventAddress();
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

})