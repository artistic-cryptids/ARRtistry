const ArtifactApplication = artifacts.require('ArtifactApplication');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');

module.exports = (deployer, network, accounts) => {
  deployer.deploy(ArtifactApplication,
    Governance.address, ArtifactRegistry.address);
};
