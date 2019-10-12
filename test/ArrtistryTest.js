const { TestHelper } = require('@openzeppelin/cli');
const { Contracts, ZWeb3 } = require('@openzeppelin/upgrades');

ZWeb3.initialize(web3.currentProvider);

const Contract = Contracts.getFromLocal('Arrtistry');

require('chai').should();

contract('Arrtistry', function () {

  beforeEach(async function () {
    this.project = await TestHelper();
  })
})
