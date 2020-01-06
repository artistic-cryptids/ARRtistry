const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');
const ARRRegistry = artifacts.require('ARRRegistry');

const { getOwner } = require('./helper/Accounts');
const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  const governance = await Governance.deployed();
  const arrs = await ARRRegistry.deployed();

  await deployer.deploy(ArtifactRegistry, getOwner(network, accounts), governance.address, arrs.address);
  const registry = await ArtifactRegistry.deployed();
  await arrs.transferOwnership(registry.address);

  await newLabel(
    'registry',
    getOwner(network, accounts),
    await ENSResolver.deployed(),
    registry,
    network,
    artifacts,
    web3,
  );
};
