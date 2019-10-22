const Governance = artifacts.require('Governance');
const PublicResolver = artifacts.require("@ensdomains/resolver/PublicResolver");

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Governance);
};
