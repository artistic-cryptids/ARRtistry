const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');

module.exports = async (deployer, network, accounts) => {
  const registry = deployer.deploy(ArtifactRegistry);
  const governance = await Governance.deployed()
  await registry.transferOwnership(Governance.address);
}
