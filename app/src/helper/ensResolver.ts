export const addressFromName = async (ens: any, name: string): Promise<string> => {
  // eslint-disable-next-line
  const namehash = require('eth-ens-namehash');
  return ens.addr(namehash.hash(name));
};

// TODO:
// eslint-disable-next-line
export const nameFromAddress = async (ens: any, address: string): Promise<string> => { 
  switch (address) {
  case '0x6704Fbfcd5Ef766B287262fA2281C105d57246a6': return 'acc1.test';
  case '0x9E1Ef1eC212F5DFfB41d35d9E5c14054F26c6560': return 'acc2.test';
  case '0xce42bdB34189a93c55De250E011c68FaeE374Dd3': return 'acc3.test';
  case '0x97A3FC5Ee46852C1Cf92A97B7BaD42F2622267cC': return 'acc4.test';
  case '0xB9dcBf8A52Edc0C8DD9983fCc1d97b1F5d975Ed7': return 'acc5.test';
  case '0x26064a2E2b568D9A6D01B93D039D1da9Cf2A58CD': return 'acc6.test';
  case '0xe84Da28128a48Dd5585d1aBB1ba67276FdD70776': return 'acc7.test';
  default: return 'noname';
  }
};
