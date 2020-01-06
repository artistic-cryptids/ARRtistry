const { expectRevert } = require('@openzeppelin/test-helpers');
const { ARTIFACT } = require('./constants/artifact');

const Consignment = artifacts.require('Consignment');
const ArrRegistry = artifacts.require('./ARRRegistry.sol');
const ArtifactRegistry = artifacts.require('./ArtifactRegistry.sol');
const Governance = artifacts.require('./Governance.sol');

contract('Consignment', async accounts => {
  const tokenOwner = accounts[0];
  const commission = 30;

  let instance;
  let arrRegistry;
  let registry;
  let tokenId;

  before(async () => {
    const governance = await Governance.deployed();
    arrRegistry = await ArrRegistry.new(governance.address, governance.address, { from: tokenOwner });
    registry = await ArtifactRegistry.new(tokenOwner, governance.address, arrRegistry.address, { from: tokenOwner });
    instance = await Consignment.new(registry.address);
    await registry.setConsignment(instance.address);
  });

  describe('consign', async () => {
    beforeEach(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
      const balance = await registry.balanceOf(tokenOwner);
      tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);
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
        'Consignment::authorized: Account not authorized',
      );
    });

    it('cannot consign to consigned account', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[2], commission, { from: accounts[1] });
      await instance.consign(tokenId, accounts[3], commission, { from: accounts[2] });

      await expectRevert(
        instance.consign(tokenId, tokenOwner, commission, { from: accounts[3] }),
        'Consignment::consign: Account is already authorized',
      );
    });
  });

  describe('consigned', async () => {
    beforeEach(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
      const balance = await registry.balanceOf(tokenOwner);
      tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);
    });

    it('token owner is consigned', async () => {
      const result = await instance.isConsigned(tokenId, tokenOwner);
      expect(result).be.eql(true);
    });

    it('if consigned then isConsigned', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });

      const result = await instance.isConsigned(tokenId, accounts[1]);
      expect(result).be.eql(true);
    });

    it('chained consigned account is consigned', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[2], commission, { from: accounts[1] });

      const result = await instance.isConsigned(tokenId, accounts[2]);
      expect(result).be.eql(true);
    });

    it('non-consigned account is not consigned', async () => {
      const result = await instance.isConsigned(tokenId, accounts[5]);
      expect(result).be.eql(false);
    });
  });

  describe('get consigned tokens', async () => {
    beforeEach(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
      const balance = await registry.balanceOf(tokenOwner);
      tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);
    });

    it('initially have zero consigned tokens', async () => {
      const result = await instance.consignedTokenIds({ from: accounts[8] });
      expect(result).be.eql([]);
    });

    it('will show all consigned tokens', async () => {
      await instance.consign(tokenId, accounts[8], commission, { from: tokenOwner });

      const result = await instance.consignedTokenIds({ from: accounts[8] });
      expect(result).be.eql([tokenId]);
    });

    it('will show all consigned tokens for chained account', async () => {
      await instance.consign(tokenId, accounts[8], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[7], commission, { from: accounts[8] });

      const result = await instance.consignedTokenIds({ from: accounts[7] });
      expect(result).be.eql([tokenId]);
    });
  });

  describe('get consignment addresses', async () => {
    beforeEach(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
      const balance = await registry.balanceOf(tokenOwner);
      tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);
    });

    it('can grab single consigned address for a tokenId', async () => {
      await instance.consign(tokenId, accounts[8], commission, { from: tokenOwner });

      const result = await instance.getConsignmentAddresses(tokenId, tokenOwner);

      expect(result[0]).be.eql(accounts[8]);
    });

    it('can grab multiple consigned address for a tokenId', async () => {
      await instance.consign(tokenId, accounts[8], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[7], commission, { from: tokenOwner });

      const result = await instance.getConsignmentAddresses(tokenId, tokenOwner);

      expect(result[0]).be.eql(accounts[8]);
      expect(result[1]).be.eql(accounts[7]);
    });

    it('can only grab consigned addresses for sender', async () => {
      await instance.consign(tokenId, accounts[8], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[7], commission, { from: accounts[8] });

      const result = await instance.getConsignmentAddresses(tokenId, tokenOwner);

      expect(result[0]).be.eql(accounts[8]);
    });
  });

  describe('get consignment info', async () => {
    beforeEach(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
      const balance = await registry.balanceOf(tokenOwner);
      tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);
    });

    it('can grab single consigned info for a tokenId', async () => {
      await instance.consign(tokenId, accounts[8], 15, { from: tokenOwner });

      const result = await instance.getConsignmentInfo(tokenId, tokenOwner, accounts[8]);

      expect(result.toNumber()).be.eql(15);
    });

    it('returns 0 for invalid params', async () => {
      const result = await instance.getConsignmentInfo(tokenId, tokenOwner, accounts[8]);

      expect(result.toNumber()).be.eql(0);
    });
  });

  describe('revoke', async () => {
    beforeEach(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
      const balance = await registry.balanceOf(tokenOwner);
      tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);
    });

    it('can revoke a simple consignment', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });

      await instance.revoke(tokenId, accounts[1]);

      const result = await instance.isConsigned(tokenId, accounts[1]);
      expect(result).to.be.eql(false);
    });

    it('only revokes one consignment out of many', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[2], commission, { from: tokenOwner });

      await instance.revoke(tokenId, accounts[1]);

      let result = await instance.isConsigned(tokenId, accounts[1]);
      expect(result).to.be.eql(false);

      result = await instance.isConsigned(tokenId, accounts[2]);
      expect(result).to.be.eql(true);
    });

    it('can revoke a complicated consignment tree', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[2], commission, { from: accounts[1] });
      await instance.consign(tokenId, accounts[3], commission, { from: accounts[1] });
      await instance.consign(tokenId, accounts[4], commission, { from: accounts[3] });
      await instance.consign(tokenId, accounts[5], commission, { from: accounts[3] });

      await instance.revoke(tokenId, accounts[3], { from: accounts[1] });

      let result = await instance.isConsigned(tokenId, accounts[1]);
      expect(result).to.be.eql(true);

      result = await instance.isConsigned(tokenId, accounts[2]);
      expect(result).to.be.eql(true);

      result = await instance.isConsigned(tokenId, accounts[3]);
      expect(result).to.be.eql(false);

      result = await instance.isConsigned(tokenId, accounts[4]);
      expect(result).to.be.eql(false);

      result = await instance.isConsigned(tokenId, accounts[5]);
      expect(result).to.be.eql(false);
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
        { from: account },
      );
    };

    beforeEach(async () => {
      await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
      const balance = await registry.balanceOf(tokenOwner);
      tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);
    });

    it('token owner can transfer if consignment is approved', async () => {
      await registry.approve(instance.address, tokenId);
      await transfer(tokenOwner);

      const owner = await registry.ownerOf(tokenId);
      expect(owner).to.be.eql(buyer);
    });

    it('authorized account can transfer', async () => {
      await registry.initConsign(tokenId, accounts[1], commission, { from: tokenOwner });

      await transfer(accounts[1]);

      const owner = await registry.ownerOf(tokenId);
      expect(owner).to.be.eql(buyer);
    });

    it('chained authorized account can transfer', async () => {
      await registry.initConsign(tokenId, accounts[1], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[2], commission, { from: accounts[1] });

      await transfer(accounts[2]);

      const owner = await registry.ownerOf(tokenId);
      expect(owner).to.be.eql(buyer);
    });

    it('non-authorized account cannot transfer', async () => {
      await expectRevert(
        transfer(accounts[5]),
        'Consignment::authorized: Account not authorized',
      );
    });

    it('transfer removes consignment', async () => {
      await registry.initConsign(tokenId, accounts[1], commission, { from: tokenOwner });
      await instance.consign(tokenId, accounts[6], commission, { from: accounts[1] });

      await transfer(accounts[6]);

      const result = await instance.consignedTokenIds({ from: accounts[6] });
      expect(result).to.be.eql([]);
    });
  });
});
