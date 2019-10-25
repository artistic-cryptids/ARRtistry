const { expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const Governance = artifacts.require('./Governance.sol');
const ArtifactRegistry = artifacts.require('./ArtifactRegistry.sol');
const ArtifactApplication = artifacts.require('./ArtifactApplication.sol');

contract('ArtifactApplication', async accounts => {
  const creator = accounts[0];
  const ARTIFACT = {
    artist: accounts[4],
    title: 'Sunshine in Gold',
    artistNationality: 'Italian',
    artistBirthYear: '1923',
    created: '10-10-10',
    medium: 'Wood',
    size: '12*20',
    metaUri: 'SpecialString',
  };

  const artifactEquality = (result, who) => {
    expect(result[0]).to.be.equal(who);
    expect(result[1]).to.be.equal(ARTIFACT.title);
    expect(result[2]).to.be.equal(ARTIFACT.artistName);
    expect(result[3]).to.be.equal(ARTIFACT.artistNationality);
    expect(result[4]).to.be.equal(ARTIFACT.artistBirthYear);
    expect(result[5]).to.be.equal(ARTIFACT.created);
    expect(result[6]).to.be.equal(ARTIFACT.medium);
    expect(result[7]).to.be.equal(ARTIFACT.size);
    expect(result[8]).to.be.equal(ARTIFACT.metaUri);
  };

  describe('Artifact Application', async () => {
    let artifactApplication;
    let governance;
    let registry;

    beforeEach(async () => {
      governance = await Governance.new({ from: creator });
      registry = await ArtifactRegistry.new(governance.address, { from: creator });
      artifactApplication = await ArtifactApplication.new(governance.address, registry.address, { from: creator });
    });

    it('should be able to apply for a proposal and get it back', async () => {
      await artifactApplication.applyFor(
        accounts[0],
        ARTIFACT.title,
        ARTIFACT.artistName,
        ARTIFACT.artistNationality,
        ARTIFACT.artistBirthYear,
        ARTIFACT.created,
        ARTIFACT.medium,
        ARTIFACT.size,
        ARTIFACT.metaUri
      );

      const result = await artifactApplication.getProposal(0);
      artifactEquality(result, accounts[0]);
    });
  });

  describe('Proposal retrieval', async () => {
    let artifactApplication;
    let governance;
    let registry;

    beforeEach(async () => {
      governance = await Governance.new({ from: creator });
      registry = await ArtifactRegistry.new(governance.address, { from: creator });
      artifactApplication = await ArtifactApplication.new(governance.address, registry.address, { from: creator });
    });

    it('should be able to retrieve a proposal thats pending', async () => {
      await artifactApplication.applyFor(
        accounts[0],
        ARTIFACT.title,
        ARTIFACT.artistName,
        ARTIFACT.artistNationality,
        ARTIFACT.artistBirthYear,
        ARTIFACT.created,
        ARTIFACT.medium,
        ARTIFACT.size,
        ARTIFACT.metaUri
      );

      const result = await artifactApplication.getProposal(0);
      artifactEquality(result, accounts[0]);
    });

    it('should not be able to retrieve a proposal thats accepted', async () => {
      await artifactApplication.applyFor(
        accounts[0],
        ARTIFACT.title,
        ARTIFACT.artistName,
        ARTIFACT.artistNationality,
        ARTIFACT.artistBirthYear,
        ARTIFACT.created,
        ARTIFACT.medium,
        ARTIFACT.size,
        ARTIFACT.metaUri
      );

      await governance.approve(0);

      await expectRevert(
        artifactApplication.getProposal(0),
        'ArtifactApplication::getProposal: proposal is not pending'
      );
    });

    it('should not be able to retrieve a proposal thats rejected', async () => {
      await artifactApplication.applyFor(accounts[0],
        ARTIFACT.title,
        ARTIFACT.artistName,
        ARTIFACT.artistNationality,
        ARTIFACT.artistBirthYear,
        ARTIFACT.created,
        ARTIFACT.medium,
        ARTIFACT.size,
        ARTIFACT.metaUri
      );

      await governance.reject(0);

      await expectRevert(
        artifactApplication.getProposal(0),
        'ArtifactApplication::getProposal: proposal is not pending'
      );
    });
  });
}); // end Registry contract
