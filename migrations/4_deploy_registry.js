const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');

module.exports = async (deployer, network, accounts) => {
  const governance = await Governance.deployed();
  await deployer.deploy(ArtifactRegistry, governance.address);
};
