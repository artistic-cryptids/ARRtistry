const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');

module.exports = async (deployer, network, accounts) => {
  const registry = await deployer.deploy(ArtifactRegistry, Governance.address);
}
