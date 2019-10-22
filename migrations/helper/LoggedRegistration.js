const namehash = require('eth-ens-namehash');
const utils = require('web3-utils');

module.exports = async function newLabel (label, owner, resolver, registrar, contract) {
  const addr = contract.address;
  const name = label + '.test';
  const hash = namehash.hash(name);
  await registrar.register(utils.sha3(label), owner);
  console.log('Registering ownership of', label, '(' + utils.sha3(label) + ') to', owner);
  await resolver.setAddr(hash, addr);
  console.log('Registered', name, '(' + hash + ') to', addr);
};
