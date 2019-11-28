const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');
const RoyaltyDistributor = artifacts.require('RoyaltyDistributor');

const { getOwner } = require('./helper/Accounts');
const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  const governance = await Governance.deployed();
  const royalty = await RoyaltyDistributor.deployed();

  await deployer.deploy(ArtifactRegistry, governance.address, governance.address, royalty.address);

  await newLabel(
    'registry',
    getOwner(network, accounts),
    await ENSResolver.deployed(),
    await ArtifactRegistry.deployed(),
    network,
    artifacts,
    web3,
  );
};