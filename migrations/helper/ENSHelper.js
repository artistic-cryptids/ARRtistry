const utils = require('web3-utils');
const namehash = require('eth-ens-namehash');

const NAME = 'artistic';
const TLD = 'test';

const ENS_RINKEBY = '0xe7410170f87102df0055eb195163a03b7f2bff4a';

const deployLocalRegistrar = async (deployer, moderator, artifacts) => {
  const ENS = artifacts.require('ENSRegistry');
  const FIFSRegistrar = artifacts.require('FIFSRegistrar');

  const ens = await ENS.deployed();

  console.log('Deploying Registrar on ganache');
  await deployer.deploy(FIFSRegistrar, ens.address, namehash.hash(TLD));
  const registrar = await FIFSRegistrar.deployed();

  await ens.setSubnodeOwner('0x0000000000000000000000000000000000000000', utils.sha3(TLD), registrar.address);
  await registrar.register(utils.sha3(NAME), moderator);
};

const setupRegistrarRinkeby = async (artifacts, web3) => {
  const ENS = artifacts.require('ENSRegistry');
  const RinkebyRegistrar = require('./RinkebyRegistrar');

  const ens = await ENS.at(ENS_RINKEBY);
  const registrarAddress = await ens.owner(namehash.hash('test'));
  console.log('Finding FIFSRegistrar on rinkeby network ' + registrarAddress);
  const registrar = await new web3.eth.Contract(RinkebyRegistrar, registrarAddress);

  const time = await registrar.methods.expiryTimes(utils.sha3(NAME)).call();

  console.log('Registrar registration expirytime is current set to ' + time);

  if (new Date(time * 1000) > Date.now()) {
    return;
  }

  await registrar.methods.register(utils.sha3(NAME), process.env.ACCOUNT_ADDRESS).send({
    from: process.env.ACCOUNT_ADDRESS,
  });

  console.log('Registered');
};

const getENS = async (artifacts, network) => {
  const ENS = artifacts.require('ENSRegistry');

  switch (network) {
  case 'development':
  case 'test':
  case 'soliditycoverage':
  case 'ganache':
    return ENS.deployed();
  case 'rinkeby':
  case 'rinkeby-fork':
    return ENS.at(ENS_RINKEBY);
  default:
    throw new Error('No owner selected for this network');
  }
};

const deployLocalReverseRegistrar = async (deployer, moderator, artifacts, resolver) => {
  const ENS = artifacts.require('ENSRegistry');
  const ReverseRegistrar = artifacts.require('ReverseRegistrar');

  const ens = await ENS.deployed();

  console.log('Deploying Reverse Registrar on ganache');
  await deployer.deploy(ReverseRegistrar, ens.address, resolver.address);
  const reverseRegistrar = await ReverseRegistrar.deployed();

  await ens.setSubnodeOwner('0x0000000000000000000000000000000000000000', utils.sha3('reverse'), moderator);
  await ens.setSubnodeOwner(
    namehash.hash('reverse'),
    utils.sha3('addr'),
    reverseRegistrar.address,
    { from: moderator },
  );
};

const reverseRegister = async (account, name, artifacts, network) => {
  const ENS = artifacts.require('ENSRegistry');
  const ReverseRegistrar = artifacts.require('ReverseRegistrar');
  const RinkebyReverseRegistrar = require('./RinkebyReverseRegistrar');

  let reverseRegistrar;

  switch (network) {
  case 'development':
  case 'test':
  case 'soliditycoverage':
  case 'ganache':
    reverseRegistrar = await ReverseRegistrar.deployed();
    break;
  case 'rinkeby':
  case 'rinkeby-fork':
    const ens = await ENS.at(ENS_RINKEBY);
    const registrarAddress = await ens.owner(namehash.hash('addr.reverse'));
    reverseRegistrar = await new web3.eth.Contract(RinkebyReverseRegistrar, registrarAddress);
    break;
  default:
    throw new Error('No owner selected for this network');
  }

  await reverseRegistrar.setName(name, { from: account });
};

module.exports = {
  getENS: getENS,
  deployLocalRegistrar: deployLocalRegistrar,
  deployLocalReverseRegistrar: deployLocalReverseRegistrar,
  setupRegistrarRinkeby: setupRegistrarRinkeby,
  name: NAME,
  tld: TLD,
  reverseRegister: reverseRegister,
};
