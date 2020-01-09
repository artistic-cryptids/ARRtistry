const { getOwner } = require('./helper/Accounts');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');

module.exports = async (deployer, network, accounts) => {
  const registry = await ArtifactRegistry.deployed();

  // Upload Nichola Theakston's art pieces
  const artworkUris = [
    'https://ipfs.globalupload.io/QmWeBdyapreRbeWaistYV676DTfFcUF3LoMT6VfafojjdA',
    'https://ipfs.globalupload.io/QmQdmTNy6R2dYoTF8Q3PSnNZq1s7HghWpZXoyesUmJqzZ7',
    'https://ipfs.globalupload.io/QmRMTQvmdziqkNzac1eJCBbAGm7RrejjzJTf9MfQsK8vGF',
    'https://ipfs.globalupload.io/QmYJaMwhsURVmL8r1DeCE7XGEh52w8AFcVfhXbzQEXLw7c',
    'https://ipfs.globalupload.io/QmZYdrEAQP8stXJmLVhndMLL7TKRzK2ss3aSQE8pGmn1un',
    'https://ipfs.globalupload.io/QmY6WYMk6p1EaRtVjhknZHtG2WWL6xoTs4fjrzJitjbQPj',
    'https://ipfs.globalupload.io/QmRb7PBb686kfPufan3nn4KwY6usVr2qEKPcRiF2jbsLqh',
    'https://ipfs.globalupload.io/Qmd6t22n9YnxVdrgSwAAP68UJ58Q1pAYbGCV3aHwGnxwzi',
    'https://ipfs.globalupload.io/QmNPh1JZdVRU6EvbosjiKMtC4i7RgikJ7sAwQXvboyKA61',
  ];
  artworkUris.forEach(artworkUri => registry.mint(getOwner(network, accounts), {
    artist: '0x67EDE48B355DA3fb5d5fB6e5964DaB9fDA56aADe',
    metaUri: artworkUri,
  }));

  // Upload DACS example art piece and add provenance
  await registry.mint(getOwner(network, accounts), {
    artist: '0xf323B526cfEbf52c349dA8F4BB4d7e6EFA55F3a6',
    metaUri: 'https://ipfs.globalupload.io/QmSrSV6KoZFWTtkBqfUs1x7VeJR3MmRKuB9HZekovaisSM',
  });

  const token = await registry.getCurrentTokenId();

  // Add provenance to DACS piece
  await registry.pieceCommissioned(token, 'Commissioned by Tate Liverpool.', '2003');
  // await registry.pieceRecovered(token, 'Recovered', '2007');
  // await registry.pieceFilm(token, 'Exhibited in The Great Gatsby', '2013');

  // Sell the DACS piece
  await registry.transfer(
    getOwner(network, accounts),
    '0x67EDE48B355DA3fb5d5fB6e5964DaB9fDA56aADe',
    token,
    'https://ipfs.globalupload.io/QmSrSV6KoZFWTtkBqfUs1x7VeJR3MmRKuB9HZekovaisSM',
    6000,
    'UK',
    '2019',
    true,
    { from: getOwner(network, accounts) },
  );
};
