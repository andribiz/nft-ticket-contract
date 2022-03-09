const { expect } = require("chai");
const { BigNumber } = require("ethers");
const IEvent = require("/Users/andrix/Documents/personal/code/hardhat/artifacts/contracts/Event.sol/Event.json");
const ITicket = require("/Users/andrix/Documents/personal/code/hardhat/artifacts/contracts/Ticket.sol/Ticket.json");

describe.only("Events Factory", function () {
  let factoryContract;
  let addressEvent;
  let usdcContract;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  before(async () => {
    // Get the ContractFactory and Signers here.
    let Token = await ethers.getContractFactory("EventsFactory");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    const fee = ethers.utils.parseUnits("0.001", 18);
    factoryContract = await Token.deploy(fee);

    Token = await ethers.getContractFactory("Token");
    const amount = ethers.utils.parseUnits("100000000", 18);
    usdcContract = await Token.deploy("USDC", "USD Coin", amount);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async () => {
      expect(await factoryContract.owner()).to.equal(owner.address);
    });
  });

  describe("Minting USDC", function () {
    it("Should mint", async () => {
      const amount = ethers.utils.parseUnits("1000", 18);
      const tx = await usdcContract.mint(addr2.address, amount);
      expect(tx.hash).to.not.equal("");

      const balance = await usdcContract.balanceOf(addr2.address);
      expect(balance.gt(BigNumber.from("0"))).eq(true);
    });
  });
  // You can nest describe calls to create subsections.

  describe("Create Event", function () {
    it("Should event created", async () => {
      const tokens = [usdcContract.address];
      const tx = await factoryContract
        .connect(addr1)
        .createEvent("Test Event", "TEst Description", "TCK", "NONE", tokens);
      expect(tx.hash).to.not.equal("");
    });

    it("Should Length events > 0", async () => {
      const eventsLength = await factoryContract.allEventsLength();
      // const evLength = parseInt(eventsLength, 10);
      expect(eventsLength).above(0);
    });

    it("Should get events address", async () => {
      const address = await addr1.getAddress();
      addressEvent = await factoryContract.getEvents(address, 0);
      expect(addressEvent).to.not.equal("");
    });

    it("Should have name in event contract", async () => {
      const contract = new ethers.Contract(addressEvent, IEvent.abi, addr1);
      const org = await contract.organizer();
      expect(org).to.eq(await addr1.getAddress());
    });
  });

  describe("Setting price", function () {
    it("can change price by organization", async () => {
      const contract = new ethers.Contract(addressEvent, IEvent.abi, addr1);
      const amount = ethers.utils.parseUnits("100", 18);
      const tx = await contract.setPrice(amount);
      expect(tx.hash).to.not.equal("");
    });

    it("price should be 100", async () => {
      const contract = new ethers.Contract(addressEvent, IEvent.abi, addr1);
      const price = await contract.price();
      expect(price.eq(ethers.utils.parseUnits("100", 18))).equal(true);
    });
  });

  describe("Buy Ticket", () => {
    it("Event Should have no balance", async () => {
      let balance = await usdcContract.balanceOf(factoryContract.address);
      expect(balance.gt(BigNumber.from("0"))).equal(false, "Begining Balance");

      //Approve
      let tx = await usdcContract
        .connect(addr2)
        .approve(factoryContract.address, ethers.constants.MaxUint256);
      expect(tx.hash).to.not.eq("");
    });

    it("Buy Transaction", async () => {
      //Buy
      const contract = new ethers.Contract(addressEvent, IEvent.abi, addr1);
      const amount = BigNumber.from("2");
      tx = await contract
        .connect(addr2)
        .buy(addr2.address, usdcContract.address, amount);
      expect(tx.hash).to.not.eq("");

      balance = await usdcContract.balanceOf(factoryContract.address);
      expect(balance.gt(BigNumber.from("0"))).equal(true);
    });

    it("Event Should have balance", async () => {
      const balance = await factoryContract.balances(
        addressEvent,
        usdcContract.address
      );

      expect(balance.gt(BigNumber.from("0"))).equal(true);
    });
  });

  describe("Ticket Process", function () {
    it("Should Have Ticket", async () => {
      const contract = new ethers.Contract(addressEvent, IEvent.abi, addr1);
      const ticketAddress = await contract.ticket();
      const ticketContract = new ethers.Contract(
        ticketAddress,
        ITicket.abi,
        addr2
      );
      const balance = await ticketContract.balanceOf(addr2.address);
      expect(balance.eq(BigNumber.from(2))).equal(true);
    });
  });
});
