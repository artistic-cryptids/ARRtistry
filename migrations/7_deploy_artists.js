const Artists = artifacts.require('Artists');
const ENSResolver = artifacts.require('ENSResolver');
const FIFSRegistrar = artifacts.require('FIFSRegistrar');

const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  await deployer.deploy(Artists, accounts[0], { from: accounts[0] });

  const artists = await Artists.deployed();

  // Some prefiled in files with artist infos
  await artists.addArtist('https://ipfs.io/ipfs/QmRxjTL7f3FRWfZEgWjdohSwWxcr8efFAUcv1EfhbuNxau');
  await artists.addArtist('https://ipfs.io/ipfs/QmTMsaqXgmBzbYjLbCqJ1eXe9FcDdJHn9BuM7wtxWtJja4');
  await artists.addArtist('https://ipfs.io/ipfs/QmPpbPxQr8cnojqCyozs9vKtNQpDFzvNhiCuy84uzQ7vHf');
  await artists.addArtist('https://ipfs.io/ipfs/QmbwLbeyn9xdLRmthXjR66mcZ9XUP9RgFyHspnQJikFm72');
  await artists.addArtist('https://ipfs.io/ipfs/QmNxAHADBx5mfcAwMUffCqYeg5FjAbbvyz14TCk2wpgni9');
  await artists.addArtist('https://ipfs.io/ipfs/QmUrH3TCEj2X5apfDiUDswGoidEByJveggYJin5qDAyjBW');
  await artists.addArtist('https://ipfs.io/ipfs/QmPiVHQeFbLo5Qq6QEsRMhK4k3M4cHFPjToesR4WN1aDnL');
  await artists.addArtist('https://ipfs.io/ipfs/QmYabbr9PZBpGiKXom2mP4pbo5yYw7LQkdYAVW12B3xe8m');

  await newLabel(
    'artists',
    accounts[0],
    await ENSResolver.deployed(),
    await FIFSRegistrar.deployed(),
    artists
  );
};
