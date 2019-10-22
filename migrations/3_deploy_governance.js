const Governance = artifacts.require('Governance');
// const PublicResolver = artifacts.require('PublicResolver');
// const namehash = require('eth-ens-namehash');
// const governanceName = 'governance.test';

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Governance);

  // TODO: If necessary register
  // const governance = await Governance.deployed();
  // const resolver = await PublicResolver.deployed();
  // await register(governanceName, resolver, governance);
};


// async function register(name, resolver, contract) {
//   const addr = contract.address;
//   const hash = namehash.hash(name);
//   console.log('Registered', name, '(', hash, ') to', addr);
//   await resolver.setAddr(hash, addr);
//   console.log('Registered', name, '(', hash, ') to', addr);
// }
