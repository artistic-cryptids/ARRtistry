const ArtifactApplication = artifacts.require('ArtifactApplication');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');
const FIFSRegistrar = artifacts.require('FIFSRegistrar');

const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  const governance = await Governance.deployed();
  const registry = await ArtifactRegistry.deployed();
  await deployer.deploy(ArtifactApplication, governance.address, registry.address);

  await newLabel(
    'application',
    accounts[0],
    await ENSResolver.deployed(),
    await FIFSRegistrar.deployed(),
    await ArtifactApplication.deployed()
  );
};
