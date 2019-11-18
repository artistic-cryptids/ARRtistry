const { constants } = require('@openzeppelin/test-helpers');
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

    it('Cant register subnode if not approved', async () => {
      await instance.register(utils.sha3('test'), accounts[4], { from: accounts[4] });

      await expectRevert(
        instance.register(utils.sha3('test'), accounts[3], { from: accounts[3] }),
        'revert',
      );
    });
  });

  describe('setRootNode', async () => {
    let instance;
    let ens;

    beforeEach(async () => {
      ens = await ENS.deployed();
      instance = await Contract.deployed();
    });

    it('Register a name sets the owner', async () => {
      await instance.register(utils.sha3('test'), accounts[4]);

      const addr = await ens.owner(namehash.hash('test.' + NAME + '.' + TLD));
      assert.equal(addr, accounts[4]);
    });
  });
});
