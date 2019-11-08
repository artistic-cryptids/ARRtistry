const Artists = artifacts.require('Artists');
const ENSResolver = artifacts.require('ENSResolver');

const newLabel = require('./helper/LoggedRegistration');
const registrarHelper = require('./helper/RegistrarHelper');

module.exports = async (deployer, network, accounts) => {
  let owner;
  switch (network) {
    case 'development':
    case 'test':
    case 'soliditycoverage':
    case 'ganache':
      owner = accounts[0];
      break;
    case 'rinkeby':
    case 'rinkeby-fork':
      owner = process.env.ACCOUNT_ADDRESS;
      break;
    default:
      throw new Error('No owner selected for this network');
  }

  await deployer.deploy(Artists, owner);

  const artists = await Artists.deployed();

  // Some prefiled in files with artist infos
  await artists.addArtist('https://ipfs.globalupload.io/Qmdgp81Wd8NhMgzHSYzWyN4FAP4CPTwtiKopznoNzyfyy8');
  await artists.addArtist('https://ipfs.globalupload.io/QmdBkQ31t6MBKZAFAq56mbQf3bb1qdjdssqjVVNXZK5SJv');
  await artists.addArtist('https://ipfs.globalupload.io/QmeribWDZU9rBJJesgAZowP2GmvQ4NSTPCjuqM6rtrRb8e');
  await artists.addArtist('https://ipfs.globalupload.io/QmeYjgK9LpijLWTGki3J9VZNj6R5c93m5enHXH4Ezqg1JN');
  await artists.addArtist('https://ipfs.globalupload.io/Qmd5Hd5G4tM28ErZr1VvdgV7oYebyavZ5jCn593JwWhuud');
  await artists.addArtist('https://ipfs.globalupload.io/Qmb2vvBVvGaXoqYEECYmyKbxpCgSbFVAPy6kCPrRCdLRPK');
  await artists.addArtist('https://ipfs.globalupload.io/QmXJ5tg8ob5XQgZvK5uTZ5pEieKhF9JpFSYdQJpNsmb7dU');
  await artists.addArtist('https://ipfs.globalupload.io/QmfSLSJoxqktyEKN4useBRPAPaJ9ENFFXmiYX5BQtm4Qu7');

  await newLabel(
    'artists',
    owner,
    await ENSResolver.deployed(),
    await registrarHelper.getRegistrar(network, artifacts, web3),
    await Artists.deployed(),
    network
  );
};
