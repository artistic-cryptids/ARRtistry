export const addressFromName = async (ens: any, name: string): Promise<string> => {
  // eslint-disable-next-line
  const namehash = require('eth-ens-namehash');
  return ens.addr(namehash.hash(name));
};

// eslint-disable-next-line
export const nameFromAddress = async (ens: any, name: string): Promise<string> => { return 'acc1.test'; }; // TODO
