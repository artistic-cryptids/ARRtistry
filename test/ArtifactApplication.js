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

      const from = accounts[0];
      const to = accounts[1];
      const tokenId = toBN(1);
      const metaUri = 'dud metaUri';
      const location = 'location';

      beforeEach(async () => {
        governance = await Governance.new({ from: creator });
        registry = await ArtifactRegistry.new(governance.address, governance.address, { from: creator });
        artifactApplication = await ArtifactApplication.new(governance.address, registry.address, { from: creator });
      });

      it('can retrieve a logged ARR', async () => {
        const price = toBN(1001);
        await artifactApplication.applyFor(
          accounts[0],
          ARTIFACT.artist,
          ARTIFACT.metaUri,
        );
        await governance.approve(0);
        await registry.transfer(from, to, tokenId, metaUri, price, location);

        const result = await artifactApplication.getARR(0);
        const actualARR = {
          from: result[0],
          to: result[1],
          tokenId: result[2],
          price: result[3],
          location: result[5],
        };

        const expectedARR = {
          from: from,
          to: to,
          tokenId: tokenId,
          price: price,
          location: location,
        };

        ARREquality(actualARR, expectedARR);
      });

      describe('ARR calculation', async () => {
        const assertARRCalculationCorrectForPrice = function (price, expectedARR) {
          it('calculates ARR correctly for €' + price / 100, async () => {
            await artifactApplication.applyFor(
              accounts[0],
              ARTIFACT.artist,
              ARTIFACT.metaUri,
            );
            await governance.approve(0);
            await registry.transfer(from, to, tokenId, metaUri, toBN(price), location);
            const result = await artifactApplication.getARR(0);
            const actualARR = result[4];
            expect(actualARR.toNumber()).to.be.eql(expectedARR);
          });
        };

        context('when sale price between €0 and €999.99', async () => {
          assertARRCalculationCorrectForPrice(99999, 0);
        });

        context('when sale price between €1000 and €50000', async () => {
          assertARRCalculationCorrectForPrice(100000, 4000);
          assertARRCalculationCorrectForPrice(3042124, 121685);
          assertARRCalculationCorrectForPrice(5000000, 200000);
        });

        context('when sale price between €50000.01 and €200000', async () => {
          assertARRCalculationCorrectForPrice(5000001, 200000);
          assertARRCalculationCorrectForPrice(6505043, 245151);
          assertARRCalculationCorrectForPrice(6505063, 245152);
          assertARRCalculationCorrectForPrice(20000000, 650000);
        });

        context('when sale price between €200000.01 and €350000', async () => {
          assertARRCalculationCorrectForPrice(20000001, 650000);
          assertARRCalculationCorrectForPrice(20178652, 651787);
          assertARRCalculationCorrectForPrice(35000000, 800000);
        });

        context('when sale price between €350000.01 and €500000', async () => {
          assertARRCalculationCorrectForPrice(35000001, 800000);
          assertARRCalculationCorrectForPrice(49685500, 873428);
          assertARRCalculationCorrectForPrice(50000000, 875000);
        });

        context('when sale price is above €500000', async () => {
          assertARRCalculationCorrectForPrice(50000001, 875000);
          assertARRCalculationCorrectForPrice(80085423, 950214);
          assertARRCalculationCorrectForPrice(200000000, 1250000);
          assertARRCalculationCorrectForPrice(111110085423, 1250000);
        });
      });
    });
  });
}); // end Registry contract
