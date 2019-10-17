const ArtifactApplication = artifacts.require('ArtifactApplication');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');

module.exports = async (deployer, network, accounts) => {
  const governance = await Governance.deployed();
  const registry = await ArtifactRegistry.deployed();
  deployer.deploy(ArtifactApplication,
    governance.address, registry.address);
};
