const { expectRevert } = require('@openzeppelin/test-helpers');

const Artists = artifacts.require('Artists');
const Governance = artifacts.require('./Governance.sol');

contract('Artists', async accounts => {
  const creator = accounts[0];
  const nonGovernanceAccount = accounts[2];
  const metaUri = 'https://ipfs.io/ipfs/QmT6zwWGhfEFmGfmPigwcmEXEJFJBZsHmMnNPdpiM5GH3i';

  describe('addArtists', async () => {
    let instance;
    let governance;

    beforeEach(async () => {
      governance = await Governance.new({ from: creator });
      instance = await Artists.new(creator, governance.address, { from: creator });
    });

    it('Should reject for a non-governance account', async () => {
      await expectRevert(
        instance.addArtist(metaUri, { from: nonGovernanceAccount }),
        'Artists::addArtist: only governor accounts can add artists',
      );
    });

    it('Should be able to add and retrieve artists', async () => {
      await instance.addArtist(metaUri);

      const total = await instance.getArtistsTotal();

      const result = await instance.getArtist(total);
      assert.equal(result, metaUri);
    });

    it('Should reject for invalid artist id', async () => {
      await expectRevert(
        instance.getArtist(1000),
        'Artists::getArtist: invalid artist id',
      );
    });

    it('Should correctly return number of artists registered on system', async () => {
      const totalBefore = await instance.getArtistsTotal();

      await instance.addArtist(metaUri);

      const totalAfter = await instance.getArtistsTotal();

      assert.equal(totalAfter.toNumber(), totalBefore.toNumber() + 1);
    });
  });
});
