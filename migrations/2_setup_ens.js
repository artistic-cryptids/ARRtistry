const ENS = artifacts.require("@ensdomains/ens/ENSRegistry");
const FIFSRegistrar = artifacts.require("@ensdomains/ens/FIFSRegistrar");
const PublicResolver = artifacts.require("@ensdomains/resolver/PublicResolver");

const utils = require('web3-utils');
const namehash = require('eth-ens-namehash');

const TLD = "test";

// const ENS_MAINNET = 0x314159265dd8dbb310642f98f50c066173c1259b;
// const ENS_ROPSTEN = 0x112234455c3a32fd11230c42e7bccd4a84e02010;
// const ENS_RINKEBY = 0xe7410170f87102df0055eb195163a03b7f2bff4a;

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(ENS);
  const ens = await ENS.deployed();

  await deployer.deploy(PublicResolver, ens.address);
  const resolver = await PublicResolver.deployed();
  await setupResolver(ens, resolver, accounts);

  await deployer.deploy(FIFSRegistrar, ens.address, namehash.hash(TLD));
  const registrar = await FIFSRegistrar.deployed();
  await setupRegistrar(ens, registrar);
};

async function setupResolver(ens, resolver, accounts) {
  const resolverNode = namehash.hash("resolver"); // 0xad3c37868ae515dba167cae3a0604972edf91b84b773bb7f0d69e6c5bb930f59
  const resolverLabel = utils.sha3("resolver");

  await ens.setSubnodeOwner("0x0000000000000000000000000000000000000000", resolverLabel, accounts[0]);
  await ens.setResolver(resolverNode, resolver.address);
  await resolver.setAddr(resolverNode, resolver.address);
}

async function setupRegistrar(ens, registrar) {
  await ens.setSubnodeOwner("0x0000000000000000000000000000000000000000", utils.sha3(TLD), registrar.address);
}
