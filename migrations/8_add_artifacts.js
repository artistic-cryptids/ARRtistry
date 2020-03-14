const { getOwner } = require('./helper/Accounts');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');

module.exports = async (deployer, network, accounts) => {
  const registry = await ArtifactRegistry.deployed();

  // Upload DACS example art piece and add provenance
  await registry.mint(getOwner(network, accounts), {
    artist: '0xf323B526cfEbf52c349dA8F4BB4d7e6EFA55F3a6',
    metaUri: '767yWF4ab-jqzIGuvnbA6bgtHM760ArawUfK2b19tD0',
  });

  const token = await registry.getCurrentTokenId();

  // Add provenance to DACS piece
  await registry.pieceCommissioned(token, 'Commissioned by Tate Liverpool.', '2003');
  await registry.pieceExhibited(token, 'Exhibited in Tate Liverpool', '2014-06-01');

  // Sell the DACS piece
  await registry.transfer(
    getOwner(network, accounts),
    '0x67EDE48B355DA3fb5d5fB6e5964DaB9fDA56aADe',
    token,
    '767yWF4ab-jqzIGuvnbA6bgtHM760ArawUfK2b19tD0',
    60000,
    'United Kingdom',
    '2019',
    false,
    { from: getOwner(network, accounts) },
  );
};
