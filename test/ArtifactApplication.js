const { expectRevert } = require('@openzeppelin/test-helpers');

const { ARTIFACT, proposalEquality } = require('./constants/artifact');

const Governance = artifacts.require('./Governance.sol');
const ArtifactRegistry = artifacts.require('./ArtifactRegistry.sol');
const ArtifactApplication = artifacts.require('./ArtifactApplication.sol');

contract('ArtifactApplication', async accounts => {
  const creator = accounts[0];

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
        ARTIFACT.artist,
        ARTIFACT.metaUri,
      );

      const result = await artifactApplication.getProposal(0);
      proposalEquality(result, accounts[0], ARTIFACT);
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
        ARTIFACT.artist,
        ARTIFACT.metaUri,
      );

      const result = await artifactApplication.getProposal(0);
      proposalEquality(result, accounts[0], ARTIFACT);
    });

    it('should not be able to retrieve a proposal thats accepted', async () => {
      await artifactApplication.applyFor(
        accounts[0],
        ARTIFACT.artist,
        ARTIFACT.metaUri,
      );

      await governance.approve(0);

      await expectRevert(
        artifactApplication.getProposal(0),
        'ArtifactApplication::getProposal: proposal is not pending',
      );
    });

    it('should not be able to retrieve a proposal thats rejected', async () => {
      await artifactApplication.applyFor(
        accounts[0],
        ARTIFACT.artist,
        ARTIFACT.metaUri,
      );

      await governance.reject(0);

      await expectRevert(
        artifactApplication.getProposal(0),
        'ArtifactApplication::getProposal: proposal is not pending',
      );
    });
  });
}); // end Registry contract
