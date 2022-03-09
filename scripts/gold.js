const { ethers, providers } = require("ethers");
const Itoken = require("/Users/andrix/Documents/personal/code/hardhat/artifacts/contracts/Gold.sol/Gold.json");

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = provider.getSigner();

async function test1(signer) {
  const tx = await signer.sendTransaction({
    to: "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    value: ethers.utils.parseEther("1.0"),
  });
  console.log(tx);
}

async function getInfo() {
  const address = await signer.getAddress();
  console.log("Address: ", address);
  console.log("Block Number :", await provider.getBlockNumber());
  const balance = await signer.getBalance();
  console.log("Account balance:", ethers.utils.formatEther(balance));

  const tokenAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  const tknContract = new ethers.Contract(tokenAddr, Itoken.abi, provider);
  const name = await tknContract.balanceOf(address);
  console.log("Token Balance :", ethers.utils.formatEther(name));

  const cap = await tknContract.cap();
  console.log("Token Cap :", ethers.utils.formatEther(cap));
}

async function minting() {
  const address = await signer.getAddress();
  const tokenAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const tknContract = new ethers.Contract(tokenAddr, Itoken.abi, signer);

  const amount = ethers.utils.parseUnits("10", 18);
  const tx = await tknContract.mint(address, amount);
  const txHash = await tx.wait();
  console.log("Transaction Hash :", txHash);

  const supply = await tknContract.totalSupply();
  console.log("Total Supply :", ethers.utils.formatEther(supply));

  const balance = await tknContract.balanceOf(address);
  console.log("Token Balance :", ethers.utils.formatEther(balance));
}

async function main() {
  // await getInfo();
  await minting();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
