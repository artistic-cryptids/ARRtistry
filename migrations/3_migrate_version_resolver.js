const VersionResolver = artifacts.require('VersionResolver');

module.exports = function (deployer) {
  deployer.deploy(VersionResolver);
};
