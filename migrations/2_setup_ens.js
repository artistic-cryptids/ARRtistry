const ENS = artifacts.require('ENSRegistry');
const FIFSRegistrar = artifacts.require('FIFSRegistrar');
const ENSResolver = artifacts.require('ENSResolver');

const utils = require('web3-utils');
const namehash = require('eth-ens-namehash');

const TLD = 'test';
const NAME = 'arrtistry';

// const ENS_MAINNET = 0x314159265dd8dbb310642f98f50c066173c1259b;
// const ENS_ROPSTEN = 0x112234455c3a32fd11230c42e7bccd4a84e02010;
const ENS_RINKEBY = '0xe7410170f87102df0055eb195163a03b7f2bff4a';

const RINKEBY_ACCOUNT = '0x594cd738A5e99134De9DE21f253eD1Be4eb27F3e';

module.exports = async (deployer, network, accounts) => {
  switch (network) {
    case 'development':
    case 'test':
    case 'soliditycoverage':
    case 'ganache':
      await localMigrate(deployer, network, accounts);
      return;
    case 'rinkeby':
    case 'rinkeby-fork':
      await rinkebyDeploy(deployer, network, [RINKEBY_ACCOUNT]);
      return;
    default:
      throw new Error('No ownership transfer defined for this network');
  }
};

async function localMigrate(deployer, network, accounts) {
  console.log("Deploying ENS on ganache");
  await deployer.deploy(ENS);
  ens = await ENS.deployed();

  console.log("Deployed Registrar on ganache");
  await deployer.deploy(FIFSRegistrar, ens.address, namehash.hash(TLD));
  const registrar = await FIFSRegistrar.deployed();
  await setupRegistrarLocal(ens, registrar, accounts[0]);

  await deployer.deploy(ENSResolver, ens.address);
  const resolver = await ENSResolver.deployed();
  await setupResolver(ens, resolver, accounts);
}

async function rinkebyDeploy(deployer, network, accounts) {
  console.log("Finding ENS contract on rinkeby network");

  moderator = '0x594cd738A5e99134De9DE21f253eD1Be4eb27F3e'
  ens = await ENS.at(ENS_RINKEBY);
}

// Setup functions
//////////////////

async function setupResolver (ens, resolver, accounts) {
  const resolverNode = namehash.hash(NAME +  "." + TLD);
  const resolverLabel = utils.sha3(NAME +  "." + TLD);

  await ens.setSubnodeOwner('0x0000000000000000000000000000000000000000', resolverLabel, accounts[0]);
  await ens.setResolver(resolverNode, resolver.address);
  await resolver.setAddr(resolverNode, resolver.address);

  console.log(resolver.address)
  console.log(await resolver.addr(namehash.hash(NAME +  "." + TLD)))
}

async function setupRegistrarRinkeby (ens, registrar, moderator) {
  const time = await registrar.expiryTimes(utils.sha3(NAME + "." + TLD));

  if (time > Date.now()) {
    return;
  }

  await registrar.register(utils.sha3(NAME), moderator);
}

async function setupRegistrarLocal (ens, registrar, moderator) {
  await ens.setSubnodeOwner('0x0000000000000000000000000000000000000000', utils.sha3(TLD), registrar.address);
  await registrar.register(utils.sha3(NAME), moderator);
}
