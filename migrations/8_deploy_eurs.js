const ERC20Eurs = artifacts.require('ERC20Eurs.sol');

module.exports = async (deployer) => {
  await deployer.deploy(ERC20Eurs);
  await ERC20Eurs.deployed();
};
