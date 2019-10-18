const VersionResolver = artifacts.require('VersionResolver');

module.exports = (deployer, network, accounts) => {
  deployer.deploy(VersionResolver);
};
