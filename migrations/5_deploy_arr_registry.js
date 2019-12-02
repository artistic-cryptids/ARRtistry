const newLabel = require('./helper/LoggedRegistration');
const { getOwner } = require('./helper/Accounts');

const Governance = artifacts.require('Governance');
const ARRRegistry = artifacts.require('ARRRegistry');
const ENSResolver = artifacts.require('ENSResolver');

module.exports = async (deployer, network, accounts) => {
  const governance = await Governance.deployed();

  await deployer.deploy(ARRRegistry, getOwner(network, accounts), governance.address);

  await newLabel(
    'arr',
    getOwner(network, accounts),
    await ENSResolver.deployed(),
    await ARRRegistry.deployed(),
    network,
    artifacts,
    web3,
  );
};
