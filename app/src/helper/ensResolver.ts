export const addressFromName = async (ens: any, name: string): Promise<string> => {
  /* // eslint-disable-next-line
  const namehash = require('eth-ens-namehash');
  const nh = namehash.hash(name);
  // ens is a truffle contract
  const resolverContract = await ens.resolver(nh);
  console.log(resolverContract);
  // resolverContract is a web3 contract
  const addr = await resolverContract.methods.addr(nh).call();
  return addr; */

  switch (name) {
  // rinkeby
  case 'deployer.dacs.test': return '0x594cd738A5e99134De9DE21f253eD1Be4eb27F3e';
  case 'dealer.matthew.test': return '0xbc70bAD29B7f37903bCaba13bA513Caa69a90ba6';
  case 'artist.harry.test': return '0x911C76dF247cd605Df62A8dC09ab80e128d7A9E2';
  case 'moderator.james.test': return '0x39be10202A6Aa302e344086A1f5dB4f09499B129';
  // ganache
  case 'artistic.test': return '0xDf08F82De32B8d460adbE8D72043E3a7e25A3B39';
  case 'acc1.test': return '0x6704Fbfcd5Ef766B287262fA2281C105d57246a6';
  case 'acc2.test': return '0x9E1Ef1eC212F5DFfB41d35d9E5c14054F26c6560';
  case 'acc3.test': return '0xce42bdB34189a93c55De250E011c68FaeE374Dd3';
  case 'acc4.test': return '0x97A3FC5Ee46852C1Cf92A97B7BaD42F2622267cC';
  case 'acc5.test': return '0xB9dcBf8A52Edc0C8DD9983fCc1d97b1F5d975Ed7';
  case 'acc6.test': return '0x26064a2E2b568D9A6D01B93D039D1da9Cf2A58CD';
  case 'acc7.test': return '0xe84Da28128a48Dd5585d1aBB1ba67276FdD70776';
  default: return 'noname';
  }
};

// TODO:
// eslint-disable-next-line
export const nameFromAddress = async (ens: any, address: string): Promise<string> => { 
  switch (address) {
  // rinkeby
  case '0x594cd738A5e99134De9DE21f253eD1Be4eb27F3e': return 'deployer.dacs.test';
  case '0xbc70bAD29B7f37903bCaba13bA513Caa69a90ba6': return 'dealer.matthew.test';
  case '0x911C76dF247cd605Df62A8dC09ab80e128d7A9E2': return 'artist.harry.test';
  case '0x39be10202A6Aa302e344086A1f5dB4f09499B129': return 'moderator.james.test';
  // ganache
  case '0xDf08F82De32B8d460adbE8D72043E3a7e25A3B39': return 'artistic.test';
  case '0x6704Fbfcd5Ef766B287262fA2281C105d57246a6': return 'acc1.test';
  case '0x9E1Ef1eC212F5DFfB41d35d9E5c14054F26c6560': return 'acc2.test';
  case '0xce42bdB34189a93c55De250E011c68FaeE374Dd3': return 'acc3.test';
  case '0x97A3FC5Ee46852C1Cf92A97B7BaD42F2622267cC': return 'acc4.test';
  case '0xB9dcBf8A52Edc0C8DD9983fCc1d97b1F5d975Ed7': return 'acc5.test';
  case '0x26064a2E2b568D9A6D01B93D039D1da9Cf2A58CD': return 'acc6.test';
  case '0xe84Da28128a48Dd5585d1aBB1ba67276FdD70776': return 'acc7.test';
  default: return 'noaddr';
  }
};
