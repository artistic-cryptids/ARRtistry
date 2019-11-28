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

    await registry.mint(tokenOwner, ARTIFACT, { from: tokenOwner });
    const balance = await registry.balanceOf(tokenOwner);
    tokenId = await registry.tokenOfOwnerByIndex(tokenOwner, balance - 1);

    registry.approve(instance.address, tokenId);
  });

  describe('authorize', async () => {
    it('token owner can consign', async () => {
      await instance.consign(tokenId, accounts[1], commission, { from: tokenOwner });
    });

    it('consigned account can consign', async () => {
      await instance.consign(tokenId, accounts[2], commission, { from: accounts[1] });
    });

    it('chained consigned account can consign', async () => {
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
    it('token owner can transfer', async () => {

    });

    it('authorized account can transfer', async () => {

    });

    it('chained authorized account can transfer', async () => {

    });

    it('non-authorized account cannot transfer', async () => {

    });
  });
});
