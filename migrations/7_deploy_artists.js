const Artists = artifacts.require('Artists');
const ENSResolver = artifacts.require('ENSResolver');
const FIFSRegistrar = artifacts.require('FIFSRegistrar');

const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Artists, accounts[0], { from: accounts[0] });

  await newLabel(
    'artists',
    accounts[0],
    await ENSResolver.deployed(),
    await FIFSRegistrar.deployed(),
    await Artists.deployed(),
  );
};
