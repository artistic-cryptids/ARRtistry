const Migrations = artifacts.require('Migrations');

module.exports = (deployer) => {
  console.log(process.env.INFURA_API_KEY);
  console.log(process.env.WALLET_MNEMONIC);
  console.log(process.env.ACCOUNT_ADDRESS);
  deployer.deploy(Migrations);
};
