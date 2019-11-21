const utils = require('web3-utils');
const namehash = require('eth-ens-namehash');

const ENS = require('../../app/src/contracts/ENSRegistry');
const Resolver = require('../../app/src/contracts/ENSResolver');
const Registrar = require('../../app/src/contracts/ArrtistryRegistrar');
const Reverse = require('../../app/src/contracts/ReverseRegistrar');

const ENSAddr = '0xe7410170f87102df0055eb195163a03b7f2bff4a';
const ResolverAddr = '0xbeD36fD0fA0d757ECFBFaF297A50505116F782C9';
const RegAddr = '0xE56Ee60A8096a0e65F04c253c46F07091245ed8e';
const ReverseAddr = '0xBbe3fD189D18C8b73BA54e9dD01F89E6b3Ee71f0';

const register = async (web3) => {
  const name = process.env.ENS_NAME;
  const domain = 'artistry.test';
  const username = name + '.' + domain;

  const label = utils.sha3(name);
  const hash = namehash.hash(username);

  const ens = await new web3.eth.Contract(ENS.abi, ENSAddr);
  const resolver = await new web3.eth.Contract(Resolver.abi, ResolverAddr);
  const registrar = await new web3.eth.Contract(Registrar.abi, RegAddr);
  const reverse = await new web3.eth.Contract(Reverse.abi, ReverseAddr);

  const sendInfo = {
    from: process.env.ACCOUNT_ADDRESS,
    gasLimit: 7000000,
  };

  // Forward
  console.log('Beginning forward register...');
  await registrar.methods.register(label, process.env.ACCOUNT_ADDRESS).send(sendInfo);
  console.log('Setting resolver...');
  await ens.methods.setResolver(hash, ResolverAddr).send(sendInfo);
  console.log('Setting up resolver...');
  await resolver.methods.setAddr(hash, process.env.ACCOUNT_ADDRESS).send(sendInfo);

  // Reverse
  console.log('Beginning reverse register...');
  await reverse.methods.claim(process.env.ACCOUNT_ADDRESS).send(sendInfo);
  const node = await reverse.methods.node(process.env.ACCOUNT_ADDRESS).call();
  console.log('Setting resolver...');
  await ens.methods.setResolver(node, ResolverAddr).send(sendInfo);
  console.log('Setting up resolver...');
  await resolver.methods.setName(node, username).send(sendInfo);
  console.log('All done!!!');
};

module.exports = {
  register: register,
};
