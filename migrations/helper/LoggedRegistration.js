const namehash = require('eth-ens-namehash');

const registrarHelper = require('./RegistrarHelper');

const TLD = registrarHelper.tld;
const NAME = registrarHelper.name;

module.exports = async function newLabel (label, owner, resolver, contract, network, artifacts, web3) {
  const addr = contract.address;

  const name = label + '.' + NAME + '.' + TLD;
  const hash = namehash.hash(name);

  console.log('Registering ownership of', name, '(' + hash + ') to', owner);
  registrarHelper.register(network, label, owner, artifacts, web3);
  await resolver.setAddr(hash, addr);
  console.log('Registered', name, '(' + hash + ') to', addr);
};
