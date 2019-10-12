const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

ZWeb3.initialize(web3.currentProvider);

const Contract = Contracts.getFromLocal('Proxyable');

require('chai').should();

contract('Proxyable', function () {

  beforeEach(async function () {
    this.project = await TestHelper();
  })

  it('should create a proxy', async function () {
    const proxy = await this.project.createProxy(Contract, {
      initMethod: 'initialize',
      initArgs: [42]
    });
    const result = await proxy.methods.magic().call();
    result.should.eq('42');
  })
})
