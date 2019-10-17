const Governance = artifacts.require('Governance');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const ArtifactApplication = artifacts.require('ArtifactApplication');

module.exports = function (deployer) {
  var registry = await deployer.deploy(ArtifactRegistry);
  var governance = await deployer.deploy(ArtifactRegistry);
};
