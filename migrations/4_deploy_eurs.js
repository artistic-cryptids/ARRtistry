const newLabel = require('./helper/LoggedRegistration');
const { getOwner } = require('./helper/Accounts');

const ERC20Eurs = artifacts.require('ERC20Eurs');
const ENSResolver = artifacts.require('ENSResolver');

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(ERC20Eurs);
  const token = await ERC20Eurs.deployed();

  for (const acc of accounts) {
    await token.mint(acc, 2000 * 100);
  }

  await newLabel(
    'eurs',
    getOwner(network, accounts),
    await ENSResolver.deployed(),
    await ERC20Eurs.deployed(),
    network,
    artifacts,
    web3,
  );
};
