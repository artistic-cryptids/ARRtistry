const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');

module.exports = (deployer, network, accounts) => {
  deployer.deploy(ArtifactRegistry, Governance.address);
};
