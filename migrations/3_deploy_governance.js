const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');

const newLabel = require('./helper/LoggedRegistration');
const registrarHelper = require('./helper/RegistrarHelper');

module.exports = async (deployer, network, accounts) => {
  let owner;
  switch (network) {
    case 'development':
    case 'test':
    case 'soliditycoverage':
    case 'ganache':
      owner = accounts[0];
      break;
    case 'rinkeby':
    case 'rinkeby-fork':
      owner = process.env.ACCOUNT_ADDRESS;
      break;
    default:
      throw new Error('No owner selected for this network');
  }

  console.log("Owner " + owner);

  await deployer.deploy(Governance);

  await newLabel(
    'governance',
    owner,
    await ENSResolver.deployed(),
    await registrarHelper.getRegistrar(network, artifacts, web3),
    await Governance.deployed(),
    network
  );
};
