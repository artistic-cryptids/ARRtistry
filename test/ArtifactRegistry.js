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
  const approvedArtist = accounts[2];
  const artifactCreatedByApprovedArtist = {
    artist: approvedArtist,
    metaUri: 'https://ipfs.globalupload.io/QmdXUTHyWMFg55t215tCnRWLCh5VnEwuVEEeG3i9DuyAwm',
  };
  const TOKEN_ID = 1;

  let governance;

  beforeEach(async function () {
    governance = await Governance.new({ from: creator });
    this.token = await ArtifactRegistryMock.new(creator, governance.address, { from: creator });
  });

  shouldBehaveLikeERC721(creator, creator, accounts);
  shouldBehaveLikeERC721ApprovalEnumerable(creator, accounts);

  let registry;

  describe('mint', async () => {
    before(async () => {
      governance = await Governance.new({ from: creator });
      registry = await ArtifactRegistry.new(creator, governance.address, { from: creator });
      await governance.approveArtist(approvedArtist, { from: creator });
    });

    it('should not allow anyone but owner or approved artists to mint tokens', async () => {
      await expectRevert(
        registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner }),
        'ArtifactRegistry::mint: Not minted by the owner',
      );
    });

    it('should not allow approved artists to mint artifacts they have not created', async () => {
      await expectRevert(
        registry.mint(approvedArtist, ARTIFACT, { from: approvedArtist }),
        'ArtifactRegistry::mint: Not minted by the owner',
      );
    });

    it('should not allow approved artists to mint artifacts to accounts other than themselves', async () => {
      await expectRevert(
        registry.mint(tokenOwner, artifactCreatedByApprovedArtist, { from: approvedArtist }),
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

    it('should allow approved artists to mint artifacts they have created to themselves', async () => {
      await registry.mint(approvedArtist, artifactCreatedByApprovedArtist, { from: approvedArtist });
    });
  });

  describe('getArtifact', async () => {
    before(async () => {
      registry = await ArtifactRegistry.new(creator, governance.address, { from: creator });
      await registry.mint(tokenOwner, ARTIFACT, { from: creator });
    });

    it('should retrieve the artifact for the token', async () => {
      const artifact = await registry.getArtifactForToken(TOKEN_ID);
      artifactEquality(artifact, ARTIFACT);
    });
  });

  describe('transfer', async () => {
    const price = 9999;
    const metaUri = 'new metaUri';
    const location = 'location';
    const date = '2019-11-11';

    before(async () => {
      registry = await ArtifactRegistry.new(creator, governance.address, { from: creator });
      await registry.mint(tokenOwner, ARTIFACT, { from: creator });
    });

    it('should reset setUri', async () => {
      await registry.transfer(tokenOwner, accounts[3], TOKEN_ID, metaUri,
        price, location, date, true, { from: tokenOwner });

      const result = await registry.getArtifactForToken(TOKEN_ID);

      expect(result[1]).to.be.equal('new metaUri');
    });
  });

  describe('getTokenIdsOfOwner', async () => {
    const accountStartingWithNoTokens = accounts[2];

    before(async () => {
      registry = await ArtifactRegistry.new(creator, governance.address, { from: creator });
    });

    it('should retrieve no token ids if no artifacts minted', async () => {
      const tokenIds = await registry.getTokenIdsOfOwner(accountStartingWithNoTokens);
      expect(tokenIds).to.eql([]);
    });

    it('should retrieve correct token ids of minted artifacts', async () => {
      await registry.mint(accountStartingWithNoTokens, ARTIFACT, { from: creator });
      await registry.mint(accountStartingWithNoTokens, ARTIFACT, { from: creator });
      const tokenIds = await registry.getTokenIdsOfOwner(accountStartingWithNoTokens);
      expect(tokenIds).to.eql([toBN(1), toBN(2)]);
    });
  });
}); // end Registry contract
