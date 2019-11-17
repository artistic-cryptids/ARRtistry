const ENS = artifacts.require('ENSRegistry');
const ENSResolver = artifacts.require('ENSResolver');

const ensHelper = require('./helper/ENSHelper');

const namehash = require('eth-ens-namehash');
const utils = require('web3-utils');

const TLD = ensHelper.tld;
const NAME = ensHelper.name;

// const ENS_MAINNET = 0x314159265dd8dbb310642f98f50c066173c1259b;
// const ENS_ROPSTEN = 0x112234455c3a32fd11230c42e7bccd4a84e02010;
const ENS_RINKEBY = '0xe7410170f87102df0055eb195163a03b7f2bff4a';

module.exports = async (deployer, network, accounts) => {
  switch (network) {
  case 'development':
  case 'test':
  case 'soliditycoverage':
  case 'ganache':
    console.log('Deploying ENS contracts on ganache');
    await localMigrate(deployer, network, accounts);
    return;
  case 'rinkeby':
  case 'rinkeby-fork':
    console.log('Deploying ENS contracts on rinkeby');
    await rinkebyDeploy(deployer, network);
    return;
  default:
    throw new Error('ENS deploy not configured for this network');
  }
};

// Migrate on a local ganache network
async function localMigrate (deployer, network, accounts) {
  console.log('Deploying ENS on ganache');
  await deployer.deploy(ENS);
  const ens = await ENS.deployed();

  await ensHelper.deployLocalRegistrar(deployer, accounts[0], artifacts);

  await deployer.deploy(ENSResolver, ens.address);
  const resolver = await ENSResolver.deployed();
  await setupResolver(ens, resolver, accounts);

  await ensHelper.deployLocalReverseRegistrar(deployer, accounts[0], artifacts, resolver);

  // For local net prepopulate with some records
  const domain = NAME + '.' + TLD;
  const domainHash = namehash.hash(domain);

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];

    const label = 'account' + i;
    const name = label + '.' + domain;
    console.log('Registering ' + account + ' to ' + name);

    const labelHash = utils.sha3(label);
    const hash = namehash.hash(name);

    await ens.setSubnodeOwner(domainHash, labelHash, account);
    await ens.setResolver(hash, resolver.address, { from: account });
    await resolver.setAddr(hash, account, { from: account });

    console.log('Reverse registering ' + name + ' to ' + account);

    await ensHelper.reverseRegister(account, name, artifacts, network);
  }
}

// Migrate on the rinkeby network
async function rinkebyDeploy (deployer, network) {
  console.log('Finding ENS contract on rinkeby network ' + ENS_RINKEBY);
  const ens = await ENS.at(ENS_RINKEBY);

  await ensHelper.setupRegistrarRinkeby(artifacts, web3);

  await deployer.deploy(ENSResolver, ens.address);
  const resolver = await ENSResolver.deployed();
  await setupResolver(ens, resolver, [process.env.ACCOUNT_ADDRESS]);
}

async function setupResolver (ens, resolver) {
  const resolverNode = namehash.hash(NAME + '.' + TLD);

  await ens.setResolver(resolverNode, resolver.address);
  await resolver.setAddr(resolverNode, resolver.address);

  console.log(resolver.address);
  console.log(await resolver.addr(namehash.hash(NAME + '.' + TLD)));
}
