const path = require("path");

module.exports = {
  /**
   * Compile the contracts to app/src so that they can be imported by
   * the frontend.
   */
  contracts_build_directory: path.join(__dirname, "app/src/contracts"),
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // eslint-disable-line camelcase
    },
  },
  plugins: ["solidity-coverage"],
};
