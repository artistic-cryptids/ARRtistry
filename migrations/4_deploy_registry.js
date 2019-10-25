const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');
const FIFSRegistrar = artifacts.require('FIFSRegistrar');

const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  const governance = await Governance.deployed();
  await deployer.deploy(ArtifactRegistry, governance.address);

  await newLabel(
    'registry',
    accounts[0],
    await ENSResolver.deployed(),
    await FIFSRegistrar.deployed(),
    await ArtifactRegistry.deployed()
  );
};
