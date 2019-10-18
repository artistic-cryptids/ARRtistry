const Users = artifacts.require('Users');

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Users);
};
