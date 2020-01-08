const Artists = artifacts.require('Artists');
const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');

const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  const owner = getOwner(network, accounts);
  const governance = await Governance.deployed();
  await deployer.deploy(Artists, owner, governance.address);

  const artists = await Artists.deployed();

  // Some prefiled in files with artist infos
  await artists.addArtist('https://ipfs.globalupload.io/QmcSJUtkFPad6DvsM7TQMF2GP9mnCg1heshGEMPk9rmURb');
  await governance.approveArtist('0xEF1728245cBB4E908a72f92AC2074175609fA6c9');
  await artists.addArtist('https://ipfs.globalupload.io/QmdBkQ31t6MBKZAFAq56mbQf3bb1qdjdssqjVVNXZK5SJv');
  await governance.approveArtist('0xcdaE5bE724930fffDAE6E30B9067f063483B6F08');
  await artists.addArtist('https://ipfs.globalupload.io/QmRT1LTLJKQpd5xDYUXCdpXos5x1Wj2tFQLgBsXU6BkyQV');
  await governance.approveArtist('0xb0f11dac7DE16b4f84E6c0471709bD34f8C9542D');
  await artists.addArtist('https://ipfs.globalupload.io/QmcFDXonNo9LqJR1wBFWWPN2HUKeoQ5YNDmKo5pY3xWgu1');
  await governance.approveArtist('0xD8Af8Ae9252c66E71c3e30f32E5bAB9a33A3e146');
  await artists.addArtist('https://ipfs.globalupload.io/Qmd5Hd5G4tM28ErZr1VvdgV7oYebyavZ5jCn593JwWhuud');
  await governance.approveArtist('0x95931D65b9Ec9fD12f41c15B2a5E669d92E72d31');
  await artists.addArtist('https://ipfs.globalupload.io/Qmb2vvBVvGaXoqYEECYmyKbxpCgSbFVAPy6kCPrRCdLRPK');
  await governance.approveArtist('0xD1a018dff3c06a6717AadC5A09B4f90ff5B8Ce5d');
  await artists.addArtist('https://ipfs.globalupload.io/QmXiWt1yjfmLDLAHUNyoFNiPf3BfpXWqUWR2iawE9Mrsds');
  await governance.approveArtist('0x315E6D0445101ff912677797F5D301Daf22DB54d');
  await artists.addArtist('https://ipfs.globalupload.io/QmUtqRy5FUokety8mpTivmhFqZ8D5ZRd9FFhp63qZKN5uv');
  await governance.approveArtist('0x54D9dd30D3a407c214680A5Ef4De649a8e59a105');
  await artists.addArtist('https://ipfs.globalupload.io/QmbYeqegpyHPnpSaxP9VDxRnHKTYjKJWLX8oiByhaid3Jm');
  await governance.approveArtist('0xf323B526cfEbf52c349dA8F4BB4d7e6EFA55F3a6');
  await artists.addArtist('https://ipfs.globalupload.io/QmWM8w6WxW7GZSvrc4pGQJ2eiANzDKfx5xsBxH2qozqYfS');
  await governance.approveArtist('0x67EDE48B355DA3fb5d5fB6e5964DaB9fDA56aADe');

  await newLabel(
    'artists',
    owner,
    await ENSResolver.deployed(),
    await Artists.deployed(),
    network,
    artifacts,
    web3,
  );
};

const getOwner = (network, accounts) => {
  switch (network) {
  case 'development':
  case 'test':
  case 'soliditycoverage':
  case 'ganache':
    return accounts[0];
  case 'rinkeby':
  case 'rinkeby-fork':
    return process.env.ACCOUNT_ADDRESS;
  default:
    throw new Error('No owner selected for this network');
  }
};
