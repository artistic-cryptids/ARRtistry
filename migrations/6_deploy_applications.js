const ArtifactApplication = artifacts.require('ArtifactApplication');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');

const newLabel = require('./helper/LoggedRegistration');

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

const getOwner = (network, accounts) => {
  switch (network) {
  case 'development':
  case 'test':
  case 'soliditycoverage':
  case 'ganache':
    return accounts[0];
  case 'rinkeby':
  case 'rinkeby-fork':
    return process.env.ACCOUNT_ADDRESS;
  default:
    throw new Error('No owner selected for this network');
  }
};
