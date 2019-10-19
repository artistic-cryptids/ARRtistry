const Governance = artifacts.require('Governance');

module.exports = (deployer, network, accounts) => {
  deployer.deploy(Governance);
};
