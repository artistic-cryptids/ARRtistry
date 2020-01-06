const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');

const newLabel = require('./helper/LoggedRegistration');

const { getOwner } = require('./helper/Accounts');

module.exports = async (deployer, network, accounts) => {
  const owner = getOwner(network, accounts);
  await deployer.deploy(Governance);

  await newLabel(
    'governance',
    owner,
    await ENSResolver.deployed(),
    await Governance.deployed(),
    network,
    artifacts,
    web3,
  );
};
