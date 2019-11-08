const namehash = require('eth-ens-namehash');
const utils = require('web3-utils');

module.exports = async function newLabel (label, owner, resolver, registrar, contract, network) {
  const addr = contract.address;
  const name = label + '.fame.test';
  const hash = namehash.hash(name);

  switch (network) {
    case 'development':
    case 'test':
    case 'soliditycoverage':
    case 'ganache':
      await registrar.register(utils.sha3(name), owner);
      break;
    case 'rinkeby':
    case 'rinkeby-fork':
      await registrar.methods.register(utils.sha3(name), owner).send({
        from: owner
      });
      break;
    default:
      throw new Error('No contract implementation for registrar found on this network');
  }

  console.log('Registering ownership of', label, '(' + utils.sha3(label) + ') to', owner);
  await resolver.setAddr(hash, addr);
  console.log('Registered', name, '(' + hash + ') to', addr);
};
