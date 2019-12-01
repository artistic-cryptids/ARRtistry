const ArtifactRegistry = artifacts.require('ArtifactRegistry');

const { getOwner } = require('./helper/Accounts');
const newLabel = require('./helper/LoggedRegistration');

module.exports = async (deployer, network, accounts) => {
  const registry = await ArtifactRegistry.deployed();
  await registry.mint(accounts[0], {
      artist: accounts[0],
      metaUri: 'https://ipfs.io/ipfs/QmRGqMQB2oaHN4dnK4uF4Xaz5Eevicvttp7fZmPjWTKr3N'
    });
};