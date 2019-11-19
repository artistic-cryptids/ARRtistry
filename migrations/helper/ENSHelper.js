const utils = require('web3-utils');
const namehash = require('eth-ens-namehash');

const NAME = 'artistry';
const TLD = 'test';

const ENS_RINKEBY = '0xe7410170f87102df0055eb195163a03b7f2bff4a';
const ARRTISTRY_REGISTRAR_RINKEBY = '0xE56Ee60A8096a0e65F04c253c46F07091245ed8e';

const deployLocalRegistrar = async (deployer, moderator, artifacts) => {
  const ENS = artifacts.require('ENSRegistry');
  const ArrtistryRegistrar = artifacts.require('ArrtistryRegistrar');

  const ens = await ENS.deployed();

  await ens.setSubnodeOwner('0x0000000000000000000000000000000000000000', utils.sha3(TLD), moderator);

  console.log('Deploying Registrar on ganache');
  await deployer.deploy(ArrtistryRegistrar, ens.address, namehash.hash(NAME + '.' + TLD));
  const registrar = await ArrtistryRegistrar.deployed();

  await ens.setSubnodeOwner(namehash.hash(TLD), utils.sha3(NAME), registrar.address, { from: moderator });
};

const setupRegistrarRinkeby = async (deployer, artifacts, web3) => {
  const ENS = artifacts.require('ENSRegistry');
  const ArrtistryRegistrar = artifacts.require('ArrtistryRegistrar');
  const RinkebyRegistrar = require('./RinkebyRegistrar');

  const ens = await ENS.at(ENS_RINKEBY);
  const registrarAddress = await ens.owner(namehash.hash('test'));
  console.log('Finding RinkebyRegistrar on rinkeby network ' + registrarAddress);
  const rinkebyRegistrar = await new web3.eth.Contract(RinkebyRegistrar, registrarAddress);

  const time = await rinkebyRegistrar.methods.expiryTimes(utils.sha3(NAME)).call();

  console.log('Finding ArrtistryRegistrar on ganache');
  const registrar = await ArrtistryRegistrar.at(ARRTISTRY_REGISTRAR_RINKEBY);

  console.log('Registrar registration expirytime is current set to ' + time);

  if (new Date(time * 1000) <= Date.now()) {
    await rinkebyRegistrar.methods.register(utils.sha3(NAME), registrar.address).send({
      from: process.env.ACCOUNT_ADDRESS,
    });

    console.log('Registered');
  }
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

const registerName = async (label, address, artifacts) => {
  const ArrtistryRegistrar = artifacts.require('ArrtistryRegistrar');
  const registrar = await ArrtistryRegistrar.deployed();

  const labelHash = utils.sha3(label);

  await registrar.register(labelHash, address);
};

module.exports = {
  getENS: getENS,
  deployLocalRegistrar: deployLocalRegistrar,
  deployLocalReverseRegistrar: deployLocalReverseRegistrar,
  setupRegistrarRinkeby: setupRegistrarRinkeby,
  name: NAME,
  tld: TLD,
  reverseRegister: reverseRegister,
  registerName: registerName,
};
