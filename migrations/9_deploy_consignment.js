const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const Consignment = artifacts.require('Consignment');
const ENSResolver = artifacts.require('ENSResolver');

const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  const owner = getOwner(network, accounts);

  const registry = await ArtifactRegistry.deployed();
  await deployer.deploy(Consignment, registry.address);
  await registry.setConsignment(Consignment.address);

  await newLabel(
    'consignment',
    owner,
    await ENSResolver.deployed(),
    await Consignment.deployed(),
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
