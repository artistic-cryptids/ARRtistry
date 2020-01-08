const { getOwner } = require('./helper/Accounts');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');

module.exports = async (deployer, network, accounts) => {
  const registry = await ArtifactRegistry.deployed();
  // await registry.mint(getOwner(network, accounts), {
  //   artist: getOwner(network, accounts),
  //   metaUri: 'https://ipfs.io/ipfs/QmRGqMQB2oaHN4dnK4uF4Xaz5Eevicvttp7fZmPjWTKr3N',
  // });

  const artworkUris = [
    'https://ipfs.globalupload.io/QmWeBdyapreRbeWaistYV676DTfFcUF3LoMT6VfafojjdA',
    'https://ipfs.globalupload.io/QmVW3XRsaSMM7ekMUtaeWokXr9SWQ1kojkZommjMBwsEvQ',
    'https://ipfs.globalupload.io/QmNf3EpnFbVqFyMTYxyjAxUJPjEAoVchFSBSQ6CWuqds5u',
    'https://ipfs.globalupload.io/QmTcyw7fHsZuXxHShJ5oy7iNevVrDnRNrrfXPWEBrvTQzf',
    'https://ipfs.globalupload.io/QmWHb9TUJVmH2ue7LxCLSkZXJZGbpFPb5CeuZpMcdtD3ov',
    'https://ipfs.globalupload.io/QmQ3DEujR26x8T7KSdBkEqc4uGUYnDeE52GsLfntLAbTxZ',
    'https://ipfs.globalupload.io/QmbH8M6U5vbciUKYnn6q3HAoYA1gtxfL7HPn2BaVEQkar6',
    'https://ipfs.globalupload.io/QmbC1uhoQsKEo2LRChMWt66LoLBxX7REyf9XNDxR5wtPAg',
    'https://ipfs.globalupload.io/QmUMASwxDsmaZU2aST2Mwzw2S2sM7yWSE7DKhYP3p1Lfaq',
  ];

  artworkUris.forEach(async a => await registry.mint(getOwner(network, accounts), {
    artist: '0x67EDE48B355DA3fb5d5fB6e5964DaB9fDA56aADe',
    metaUri: a,
  }));
};
