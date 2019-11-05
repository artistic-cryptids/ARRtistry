const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const ARTIFACT = {
  artist: ZERO_ADDRESS,
  metaUri: 'https://ipfs.io/ipfs/QmT6zwWGhfEFmGfmPigwcmEXEJFJBZsHmMnNPdpiM5GH3i',
};

function proposalEquality (actual, proposer, expectedArtifact) {
  expect(actual[0]).to.be.equal(proposer);
  artifactEquality(actual, expectedArtifact, 1);
};

function artifactEquality (actual, expected, offset = 0) {
  expect(actual[offset]).to.be.equal(expected.artist);
  expect(actual[offset + 1]).to.be.equal(expected.metaUri);
};

function ARREquality (actual, expected, offset = 0) {
  expect(actual[offset]).to.be.equal(expected.from);
  expect(actual[offset + 1]).to.be.equal(expected.to);
  expect(actual[offset + 2]).to.eql(expected.tokenId);
  expect(actual[offset + 3]).to.eql(expected.price);
  expect(actual[offset + 4]).to.eql(expected.location)
};

module.exports = {
  ARTIFACT,
  artifactEquality,
  proposalEquality,
  ARREquality,
};
