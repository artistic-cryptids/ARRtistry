const Governance = artifacts.require('Governance');
const PublicResolver = artifacts.require('PublicResolver');
const FIFSRegistrar = artifacts.require('FIFSRegistrar');

var newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Governance, {from: accounts[0]});

  await newLabel(
    'governance',
    accounts[0],
    await PublicResolver.deployed(),
    await FIFSRegistrar.deployed(),
    await Governance.deployed()
  );
};
