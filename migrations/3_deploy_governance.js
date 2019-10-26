const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');
const FIFSRegistrar = artifacts.require('FIFSRegistrar');

const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Governance, { from: accounts[0] });

  await newLabel(
    'governance',
    accounts[0],
    await ENSResolver.deployed(),
    await FIFSRegistrar.deployed(),
    await Governance.deployed(),
  );
};
