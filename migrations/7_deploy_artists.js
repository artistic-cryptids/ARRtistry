const Artists = artifacts.require('Artists');
const ENSResolver = artifacts.require('ENSResolver');
const FIFSRegistrar = artifacts.require('FIFSRegistrar');

const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Artists, accounts[0], { from: accounts[0] });

  const artists = await Artists.deployed();

  await artists.addArtist('Vincent Van Gogh', accounts[2], 'Dutch', '1853', '1890');
  await artists.addArtist('Pablo Picasso', accounts[2], 'Spanish', '1881', '1973');
  await artists.addArtist('Leonardo da Vinci', accounts[2], 'Italian', '1452', '1519');
  await artists.addArtist('Claude Monet', accounts[2], 'French', '1840', '1926');
  await artists.addArtist('Andy Warhol', accounts[2], 'American', '1928', '1987');
  await artists.addArtist('Salvador Dali', accounts[2], 'Spanish', '1904', '1989');
  await artists.addArtist('Michelangelo', accounts[2], 'Italian', '1475', '1564');
  await artists.addArtist('Édouard Manet', accounts[2], 'French', '1832', '1883');

  await newLabel(
    'artists',
    accounts[0],
    await ENSResolver.deployed(),
    await FIFSRegistrar.deployed(),
    artists,
  );
};
