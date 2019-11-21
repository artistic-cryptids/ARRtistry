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
  await artists.addArtist('https://ipfs.globalupload.io/QmdBkQ31t6MBKZAFAq56mbQf3bb1qdjdssqjVVNXZK5SJv');
  await artists.addArtist('https://ipfs.globalupload.io/QmRT1LTLJKQpd5xDYUXCdpXos5x1Wj2tFQLgBsXU6BkyQV');
  await artists.addArtist('https://ipfs.globalupload.io/QmcFDXonNo9LqJR1wBFWWPN2HUKeoQ5YNDmKo5pY3xWgu1');
  await artists.addArtist('https://ipfs.globalupload.io/Qmd5Hd5G4tM28ErZr1VvdgV7oYebyavZ5jCn593JwWhuud');
  await artists.addArtist('https://ipfs.globalupload.io/Qmb2vvBVvGaXoqYEECYmyKbxpCgSbFVAPy6kCPrRCdLRPK');
  await artists.addArtist('https://ipfs.globalupload.io/QmXiWt1yjfmLDLAHUNyoFNiPf3BfpXWqUWR2iawE9Mrsds');
  await artists.addArtist('https://ipfs.globalupload.io/QmUtqRy5FUokety8mpTivmhFqZ8D5ZRd9FFhp63qZKN5uv');

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
