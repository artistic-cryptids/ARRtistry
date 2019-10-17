const Governance = artifacts.require('Governance');

module.exports = function (deployer) {
  deployer.deploy(Governance);
};
