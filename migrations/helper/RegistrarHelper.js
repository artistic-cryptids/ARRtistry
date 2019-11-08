const utils = require('web3-utils');
const namehash = require('eth-ens-namehash');

const NAME = 'fame';
const TLD = 'test';

module.exports = {
  getRegistrar: async function getRegistrar (network, artifacts, web3) {
    const ENS = artifacts.require('ENSRegistry');
    const FIFSRegistrar = artifacts.require('FIFSRegistrar');
    const RinkebyRegistrar = require('./RinkebyRegistrar');

    switch (network) {
      case 'development':
      case 'test':
      case 'soliditycoverage':
      case 'ganache':
        return await FIFSRegistrar.deployed();
      case 'rinkeby':
      case 'rinkeby-fork':
        const ens = await ENS.at('0xe7410170f87102df0055eb195163a03b7f2bff4a');
        const registrarAddress = await ens.owner(namehash.hash('test'));
        console.log("Finding FIFSRegistrar on rinkeby network " + registrarAddress);
        const registrar = await new web3.eth.Contract(RinkebyRegistrar, registrarAddress);
        return registrar;
      default:
        throw new Error('No registrar found for this network');
    }
  },
  deployRegistrar: async function deployLocalRegistrar (moderator, artifacts) {
    const ENS = artifacts.require('ENSRegistry');
    const FIFSRegistrar = artifacts.require('FIFSRegistrar');

    const ens = await ENS.deployed();

    console.log("Deploying Registrar on ganache");
    await deployer.deploy(FIFSRegistrar, ens.address, namehash.hash(TLD));
    const registrar = await FIFSRegistrar.deployed();

    await ens.setSubnodeOwner('0x0000000000000000000000000000000000000000', utils.sha3(TLD), registrar.address);
    await registrar.register(utils.sha3(NAME), moderator);
  },
  register: async function register () {

  },
  name: NAME,
  tld: TLD
}
