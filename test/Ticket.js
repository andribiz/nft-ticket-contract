const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("Ticket Contract", function () {
  let ticketContract;
  let addressEvent;
  let usdcContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  before(async function () {
    // Get the ContractFactory and Signers here.
    let Token = await ethers.getContractFactory("Ticket");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    ticketContract = await Token.deploy("Test Ticket", "TCK", "NONE");
  });

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await ticketContract.ticketOwner()).to.equal(owner.address);
    });
  });

  describe("Minting Ticket", function () {
    it("Should mint", async () => {
      const tx = await ticketContract.connect(owner).mintTicket(addr1.address);
      expect(tx.hash).to.not.equal("");
      const balanceTicket = await ticketContract.balanceOf(addr1.address);
      expect(balanceTicket.gt(BigNumber.from("0"))).equal(true);
    });
    it("Should ticket same with addr1", async () => {
      const ticketAddress = await ticketContract.ownerOf(1);
      expect(ticketAddress).equal(addr1.address);
    });
    it("Should addr1 has balance", async () => {
      const balanceTicket = await ticketContract.balanceOf(addr1.address);
      expect(balanceTicket.gt(BigNumber.from("0"))).equal(true);
    });
  });

  describe("Attending Ticket", function () {
    it("Should attend ticket", async () => {
      const tx = await ticketContract.connect(addr1).attendTicket(1);
      expect(tx.hash).to.not.equal("");
      const isAttended = await ticketContract.isAttended(1);
      expect(isAttended).equal(true);
    });
  });
});
