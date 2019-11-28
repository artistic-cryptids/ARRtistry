const newLabel = require('./helper/LoggedRegistration');
const { getOwner } = require('./helper/Accounts');

const ERC20Eurs = artifacts.require('ERC20Eurs');
const RoyaltyDistributor = artifacts.require('RoyaltyDistributor');
const ENSResolver = artifacts.require('ENSResolver');

module.exports = async (deployer, network, accounts) => {
  const token = await ERC20Eurs.deployed();
  await deployer.deploy(RoyaltyDistributor, token.address);
  await RoyaltyDistributor.deployed();

  await newLabel(
    'royalty',
    getOwner(network, accounts),
    await ENSResolver.deployed(),
    await RoyaltyDistributor.deployed(),
    network,
    artifacts,
    web3,
  );
};
