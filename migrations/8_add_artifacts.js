const { getOwner } = require('./helper/Accounts');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');

module.exports = async (deployer, network, accounts) => {
  const registry = await ArtifactRegistry.deployed();
  // await registry.mint(getOwner(network, accounts), {
  //   artist: getOwner(network, accounts),
  //   metaUri: 'https://ipfs.io/ipfs/QmRGqMQB2oaHN4dnK4uF4Xaz5Eevicvttp7fZmPjWTKr3N',
  // });
};
