const namehash = require('eth-ens-namehash');
const utils = require('web3-utils');

const registrarHelper = require('./RegistrarHelper');

const TLD = registrarHelper.tld;
const NAME = registrarHelper.name;

module.exports = async function newLabel (label, owner, resolver, contract, network, artifacts, web3) {
  const addr = contract.address;

  const name = label + '.' + NAME + '.' + TLD;
  const hash = namehash.hash(name);

  registrarHelper.register(network, label, owner, artifacts, web3);

  console.log('Registering ownership of', label, '(' + utils.sha3(label) + ') to', owner);
  await resolver.setAddr(hash, addr);
  console.log('Registered', name, '(' + hash + ') to', addr);
};
