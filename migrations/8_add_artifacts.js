const ArtifactRegistry = artifacts.require('ArtifactRegistry');

module.exports = async (deployer, network, accounts) => {
  const registry = await ArtifactRegistry.deployed();
  await registry.mint(getOwner(), {
    artist: getOwner(),
    metaUri: 'https://ipfs.io/ipfs/QmRGqMQB2oaHN4dnK4uF4Xaz5Eevicvttp7fZmPjWTKr3N',
  });
};
