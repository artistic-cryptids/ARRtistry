const { expectRevert } = require('@openzeppelin/test-helpers');
const namehash = require('eth-ens-namehash');
const utils = require('web3-utils');

const ENS = artifacts.require('ENSRegistry');
const Contract = artifacts.require('ArrtistryRegistrar');

const NAME = 'artistry';
const TLD = 'test';

contract('ArrtistryRegistrar', async accounts => {
  describe('register', async () => {
    let instance;
    let ens;

    beforeEach(async () => {
      ens = await ENS.deployed();
      instance = await Contract.deployed();
    });

    it('Register a name sets the owner', async () => {
      await instance.register(utils.sha3('test'), accounts[4], { from: accounts[4] });

      const addr = await ens.owner(namehash.hash('test.' + NAME + '.' + TLD));
      assert.equal(addr, accounts[4]);
    });

    it('Can\'t register subnode if not approved', async () => {
      await instance.register(utils.sha3('test'), accounts[4], { from: accounts[4] });

      await expectRevert(
        instance.register(utils.sha3('test'), accounts[3], { from: accounts[3] }),
        'revert',
      );
    });
  });

  describe('setRootNode', async () => {
    const rootNode = 'artistry.test';
    let instance;

    beforeEach(async () => {
      instance = await Contract.deployed();
      await instance.setRootNode(namehash.hash(rootNode));
    });

    it('Can reset the rootnode', async () => {
      await instance.setRootNode(namehash.hash('different.test'));

      const node = await instance.rootNode.call();

      assert.equal(node, namehash.hash('different.test'));
    });

    it('Can\'t reset rootnode unless owner', async () => {
      await expectRevert(
        instance.setRootNode(namehash.hash('different.test'), { from: accounts[2] }),
        'revert',
      );
    });
  });
});
