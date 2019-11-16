export const addressFromName = async (ens: any, name: string): Promise<string> => {
  const namehash = require('eth-ens-namehash');
  return ens.addr(namehash.hash(name));
}

export const nameFromAddress = async (ens: any, name: string): Promise<string> => {
  // todo: actual reverse lookup
  return 'acc1.test';
}