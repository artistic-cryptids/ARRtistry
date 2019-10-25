const { constants } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;
const namehash = require('eth-ens-namehash');

const Contract = artifacts.require('ENSResolver');

contract('ENSResolver', async accounts => {
  let instance;

  beforeEach(async () => {
    instance = await Contract.deployed();
  });

  describe('supportInterface', async () => {
    it('Should support interface supportInterface', async () => {
      const result = await instance.supportsInterface('0x01ffc9a7');

      assert.equal(result, true);
    });

    it('Should support interface addr', async () => {
      const result = await instance.supportsInterface('0x3b3b57de');

      assert.equal(result, true);
    });

    it('Should not support unknown interface', async () => {
      const result = await instance.supportsInterface('0x21ffc9a7');

      assert.equal(result, false);
    });
  });

  describe('addr', async () => {
    it('Should resolve to 0 addr on unknown node', async () => {
      const resolvedAddr = await instance.addr(namehash.hash('Unknown'));

      assert.equal(resolvedAddr, ZERO_ADDRESS);
    });

    it('Should resolve to correct addr once set', async () => {
      await instance.setAddr(namehash.hash('test'), accounts[4]);

      const resolvedAddr = await instance.addr(namehash.hash('test'));
      assert.equal(resolvedAddr, accounts[4]);
    });

    it('Should be able to reset addr on', async () => {
      await instance.setAddr(namehash.hash('test'), accounts[4]);
      await instance.setAddr(namehash.hash('test'), accounts[6]);

      const resolvedAddr = await instance.addr(namehash.hash('test'));
      assert.equal(resolvedAddr, accounts[6]);
    });
  });
});
