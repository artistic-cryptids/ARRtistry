const Artists = artifacts.require('Artists');
const Governance = artifacts.require('Governance');
const ENSResolver = artifacts.require('ENSResolver');

const newLabel = require('./helper/LoggedRegistration');
const { getOwner } = require('./helper/Accounts');

const artists = require('./data/artists.json');

module.exports = async (deployer, network, accounts) => {
  const owner = getOwner(network, accounts);
  const governance = await Governance.deployed();
  await deployer.deploy(Artists, owner, governance.address);

  const artists = await Artists.deployed();

  // Some prefiled in files with artist infos
  for artist in artists {
    await artists.addArtist(artist.metaUri);
  }

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
