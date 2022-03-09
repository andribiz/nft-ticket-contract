async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Token = await ethers.getContractFactory("EventsFactory");
  //Deploy Contract
  const fee = ethers.utils.parseUnits("0.001", 18);
  const token = await Token.deploy(fee);

  console.log("Contract address:", token.address);

  //Deploy mockUSDC
  const tokenUSDC = await ethers.getContractFactory("Token");
  let amount = ethers.utils.parseUnits("100000000", 18);
  const usdcContract = await tokenUSDC.deploy("USDC", "USD Coin", amount);

  amount = ethers.utils.parseUnits("1000", 18);
  const tx = await usdcContract.mint(deployer.address, amount);
  console.log("USDC address:", usdcContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
