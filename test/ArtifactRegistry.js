const { expectRevert } = require('@openzeppelin/test-helpers');
const { ARTIFACT, artifactEquality } = require('./constants/artifact');
const { expect } = require('chai');
const { toBN } = web3.utils;

const { shouldBehaveLikeERC721 } = require('./behaviours/ERC721.behavior.js');
const { shouldBehaveLikeERC721ApprovalEnumerable } = require('./behaviours/ERC721ApprovalEnumerable.behavior.js');

const Governance = artifacts.require('./Governance.sol');
const ArtifactRegistry = artifacts.require('./ArtifactRegistry.sol');
const ArtifactRegistryMock = artifacts.require('./ArtifactRegistryMock.sol');

contract('ArtifactRegistry', async accounts => {
  const creator = accounts[0];
  const tokenOwner = accounts[1];
  const TOKEN_ID = 1;

  let governance;

  beforeEach(async function () {
    governance = await Governance.new({ from: creator });
    this.token = await ArtifactRegistryMock.new(creator, governance.address, { from: creator });
  });

  shouldBehaveLikeERC721(creator, creator, accounts);
  shouldBehaveLikeERC721ApprovalEnumerable(creator, accounts);

  let registry;

  before(async () => {
    governance = await Governance.new({ from: creator });
    registry = await ArtifactRegistry.new(creator, governance.address, { from: creator });
  });

  describe('mint', async () => {
    it('should not allow anyone but owner to mint tokens', async () => {
      await expectRevert(
        registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner }),
        'ArtifactRegistry::mint: Not minted by the owner',
      );
    });

    before(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: creator });
    });

    it('should allow the owner to mint a token', async () => {
      registry.mint.call(tokenOwner, ARTIFACT, { from: creator });
    });

    it('should increment the token ids', async () => {
      const tokenId = await registry._tokenId.call();
      expect(tokenId.toString()).to.be.equal('1');
    });

    it('should mint the token', async () => {
      expect(await registry.ownerOf.call(TOKEN_ID)).to.be.equal(tokenOwner);
    });

    it('should set the token metauri', async () => {
      expect(await registry.tokenURI.call(TOKEN_ID)).to.be.equal(ARTIFACT.metaUri);
    });
  });

  describe('getArtifact', async () => {
    before(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: creator });
    });

    it('should retrieve the artifact for the token', async () => {
      const artifact = await registry.getArtifactForToken(TOKEN_ID);
      artifactEquality(artifact, ARTIFACT);
    });
  });

  describe('transfer', async () => {
    before(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: creator });
    });

    it('should reset setUri', async () => {
      const price = 9999;
      await registry.transfer(tokenOwner, accounts[3], TOKEN_ID, 'new metaUri',
        price, 'location', '2019-11-11', { from: tokenOwner });

      const result = await registry.getArtifactForToken(TOKEN_ID);

      expect(result[1]).to.be.equal('new metaUri');
    });
  });

  describe('getTokenIdsOfOwner', async () => {
    const accountStartingWithNoTokens = accounts[2];

    it('should retrieve no token ids if no artifacts minted', async () => {
      const tokenIds = await registry.getTokenIdsOfOwner(accountStartingWithNoTokens);
      expect(tokenIds).to.eql([]);
    });

    it('should retrieve correct token ids of minted artifacts', async () => {
      await registry.mint(accountStartingWithNoTokens, ARTIFACT, { from: creator });
      await registry.mint(accountStartingWithNoTokens, ARTIFACT, { from: creator });
      const tokenIds = await registry.getTokenIdsOfOwner(accountStartingWithNoTokens);
      expect(tokenIds).to.eql([toBN(4), toBN(5)]);
    });
  });
}); // end Registry contract
