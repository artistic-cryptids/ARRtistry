const { constants, expectRevert } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;
const { expect } = require('chai');

const { shouldBehaveLikeERC721 } = require('./behaviours/ERC721.behavior.js');

const ArtifactRegistry = artifacts.require('./ArtifactRegistry.sol');
const ArtifactRegistryMock = artifacts.require('./ArtifactRegistryMock.sol');

contract('ArtifactRegistry', async accounts => {
  const creator = accounts[0];
  const tokenOwner = accounts[1];
  const ARTIFACT = {
    artist: ZERO_ADDRESS,
    title: 'Sunshine in Gold',
    medium: 'Wood',
    edition: '12',
    created: '10-10-10',
    metaUri: 'SpecialString',
  };
  const TOKEN_ID = 1;

  beforeEach(async function () {
    this.token = await ArtifactRegistryMock.new(creator, { from: creator });
  });

  shouldBehaveLikeERC721(creator, creator, accounts);

  let registry;

  before(async () => {
    registry = await ArtifactRegistry.new(creator, { from: creator });
  });

  describe('mint', async () => {
    it('should not allow anyone but owner to mint tokens', async () => {
      await expectRevert(
        registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner }),
        'ArtifactRegistry::mint: Not minted by the owner'
      );
    });

    before(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: creator });
    });

    it('should allow the owner to mint a token', async () => {
      registry.mint.call(tokenOwner, ARTIFACT, { from: creator });
    });

    it('should increment the token ids', async () => {
      const tokenId = await registry._tokenIds.call();
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
      expect(artifact.artist).to.be.equal(ARTIFACT.artist);
      expect(artifact.title).to.be.equal(ARTIFACT.title);
      expect(artifact.medium).to.be.equal(ARTIFACT.medium);
      expect(artifact.edition).to.be.equal(ARTIFACT.edition);
      expect(artifact.created).to.be.equal(ARTIFACT.created);
      expect(artifact.metaUri).to.be.equal(ARTIFACT.metaUri);
    });
  });
}); // end Registry contract
