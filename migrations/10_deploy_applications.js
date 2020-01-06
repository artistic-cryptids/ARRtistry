const ArtifactApplication = artifacts.require('ArtifactApplication');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');

const newLabel = require('./helper/LoggedRegistration');
const { getOwner } = require('./helper/Accounts');

module.exports = async (deployer, network, accounts) => {
  const owner = getOwner(network, accounts);

  const governance = await Governance.deployed();
  const registry = await ArtifactRegistry.deployed();
  await deployer.deploy(ArtifactApplication, governance.address, registry.address);

  await newLabel(
    'application',
    owner,
    await ENSResolver.deployed(),
    await ArtifactApplication.deployed(),
    network,
    artifacts,
    web3,
  );
};
