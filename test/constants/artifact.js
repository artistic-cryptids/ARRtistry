const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const ARTIFACT = {
  artist: ZERO_ADDRESS,
  title: 'Sunshine in Gold',
  artistName: 'Monet',
  artistNationality: 'Italian',
  artistBirthYear: '1923',
  created: '10-10-10',
  medium: 'Wood',
  size: '12*20',
  imageUri: 'QmSkyQHeX9wVRGyQ6R5w4511s3gCb9XigoW9G2S7cjT8a7',
  metaUri: 'SpecialString',
};

function proposalEquality (actual, proposer, expectedArtifact) {
  expect(actual[0]).to.be.equal(proposer);
  artifactEquality(actual, expectedArtifact, 1);
};

function artifactEquality (actual, expected, offset = 0) {
  expect(actual[offset]).to.be.equal(expected.artist);
  expect(actual[offset + 1]).to.be.equal(expected.title);
  expect(actual[offset + 2]).to.be.equal(expected.artistName);
  expect(actual[offset + 3]).to.be.equal(expected.artistNationality);
  expect(actual[offset + 4]).to.be.equal(expected.artistBirthYear);
  expect(actual[offset + 5]).to.be.equal(expected.created);
  expect(actual[offset + 6]).to.be.equal(expected.medium);
  expect(actual[offset + 7]).to.be.equal(expected.size);
  expect(actual[offset + 8]).to.be.equal(expected.imageUri);
  expect(actual[offset + 9]).to.be.equal(expected.metaUri);
};

module.exports = {
  ARTIFACT,
  artifactEquality,
  proposalEquality,
};
