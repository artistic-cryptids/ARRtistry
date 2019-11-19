const namehash = require('eth-ens-namehash');

const ensHelper = require('./ENSHelper');

const TLD = ensHelper.tld;
const NAME = ensHelper.name;

module.exports = async function newLabel (label, owner, resolver, contract, network, artifacts, web3) {
  const addr = contract.address;

  const domain = NAME + '.' + TLD;
  const name = label + '.' + domain;

  const hash = namehash.hash(name);

  const ens = await ensHelper.getENS(artifacts, network);

  console.log('Registering ownership of', name, '(' + hash + ') to', owner);
  await ensHelper.registerName(label, owner, artifacts, network);
  console.log('Registered ownership of', name, '(' + hash + ') to', await ens.owner(hash));

  console.log('Registering resolver of', name, '(' + hash + ') to', resolver.address);
  await ens.setResolver(hash, resolver.address, { from: owner });
  console.log('Registered resolver of', name, '(' + hash + ') to', await ens.resolver(hash));

  console.log('Registering', name, '(' + hash + ') to', addr);
  await resolver.setAddr(hash, addr, { from: owner });
  console.log('Registered', name, '(' + hash + ') to', await resolver.addr(hash));
};
