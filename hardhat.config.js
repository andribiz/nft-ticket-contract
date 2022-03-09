require("@nomiclabs/hardhat-waffle");
/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const GANACHE_PRIVATE_KEY =
  "0x1acf5efa6a26e907b7912ae950f79dcdc7bc43f34bf0aa84a8fb88c41c2e5c2f";

module.exports = {
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      live: false,
      saveDeployments: true,
      tags: ["local"],
    },
    ganache: {
      url: `http://127.0.0.1:8545`,
      accounts: [`${GANACHE_PRIVATE_KEY}`],
    },
    hardhat: {},
  },
};
