const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

ZWeb3.initialize(web3.currentProvider);

const Sample = Contracts.getFromLocal('Arrtistry');

require('chai').should();

contract('Sample', function () {

  beforeEach(async function () {
    this.project = await TestHelper();
  })

  it('should create a proxy', async function () {
    const proxy = await this.project.createProxy(Sample);
  })
})
