const { expectRevert } = require('@openzeppelin/test-helpers');
const { ARTIFACT } = require('./constants/artifact');

const Consignment = artifacts.require('Consignment');
const ArtifactRegistry = artifacts.require('./ArtifactRegistry.sol');
const Governance = artifacts.require('./Governance.sol');

contract('Consignment', async accounts => {
  const tokenOwner = accounts[0];
  const commission = 30;

  let instance;
  let registry;
  let tokenId;

  before(async () => {
    const governance = await Governance.deployed();
    registry = await ArtifactRegistry.new(tokenOwner, governance.address, { from: tokenOwner });
    instance = await Consignment.new(registry.address);
  });

  describe('authorize', async () => {
    beforeEach(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
      const balance = await registry.balanceOf(tokenOwner);
      tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);

      registry.approve(instance.address, tokenId);
    });

    it('token owner can consign', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });
    });

    it('consigned account can consign', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[2], commission, { from: accounts[1] });
    });

    it('chained consigned account can consign', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[2], commission, { from: accounts[1] });
      await instance.consign(tokenId, accounts[3], commission, { from: accounts[2] });
    });

    it('non-consigned account cannot consign', async () => {
      await expectRevert(
        instance.consign(tokenId, accounts[4], commission, { from: accounts[5] }),
        'Consignment::authorized: Account not authorized'
      );
    });
  });

  describe('transfer', async () => {
    const buyer = accounts[7];
    const metaUri = 'metaUri';
    const location = 'location';
    const date = 'date';

    const transfer = async (account) => {
      await instance.transfer(
        tokenOwner,
        buyer,
        tokenId,
        metaUri,
        100,
        location,
        date,
        false,
        { from: account }
      );
    }

    beforeEach(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
      const balance = await registry.balanceOf(tokenOwner);
      tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);

      registry.approve(instance.address, tokenId);
    });

    it('token owner can transfer', async () => {
      await transfer(tokenOwner);

      const owner = await registry.ownerOf(tokenId);
      expect(owner).to.be.eql(buyer);
    });

    it('authorized account can transfer', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });

      await transfer(accounts[1]);

      const owner = await registry.ownerOf(tokenId);
      expect(owner).to.be.eql(buyer);
    });

    it('chained authorized account can transfer', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[2], commission, { from: accounts[1] });

      await transfer(accounts[2]);

      const owner = await registry.ownerOf(tokenId);
      expect(owner).to.be.eql(buyer);
    });

    it('non-authorized account cannot transfer', async () => {
      await expectRevert(
        transfer(accounts[5]),
        'Consignment::authorized: Account not authorized'
      );
    });
  });
});
