const { toBN } = web3.utils;
const { expectRevert } = require('@openzeppelin/test-helpers');

const { ARTIFACT, proposalEquality, ARREquality } = require('./constants/artifact');

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
      registry = await ArtifactRegistry.new(governance.address, governance.address, { from: creator });
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
      registry = await ArtifactRegistry.new(governance.address, governance.address, { from: creator });
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

    describe('ARR retrieval', async () => {
      let artifactApplication;
      let governance;
      let registry;

      beforeEach(async () => {
        governance = await Governance.new({ from: creator });
        registry = await ArtifactRegistry.new(governance.address, governance.address, { from: creator });
        artifactApplication = await ArtifactApplication.new(governance.address, registry.address, { from: creator });
      });

      it('can retrieve a logged ARR', async () => {
        const from = accounts[0];
        const to = accounts[1];
        const tokenId = toBN(1);
        const price = toBN(1001);
        const location = 'location';

        await artifactApplication.applyFor(
          accounts[0],
          ARTIFACT.artist,
          ARTIFACT.metaUri,
        );
        await governance.approve(0);
        await registry.transfer(from, to, tokenId, 'dud metaUri', price, location);

        const result = await artifactApplication.getARR(0);
        const actualARR = {
          from: result[0],
          to: result[1],
          tokenId: result[2],
          price: result[3],
          location: result[5],
        }

        const expectedARR = {
          from: from,
          to: to,
          tokenId: tokenId,
          price: price,
          location: location,
        };

        ARREquality(actualARR, expectedARR);
      });
    });
  });
}); // end Registry contract
