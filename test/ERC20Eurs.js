const { toBN } = web3.utils;

const { shouldBehaveLikeERC20 } = require('./behaviours/ERC20.behavior.js');

const ERC20Eurs = artifacts.require('ERC20Eurs');

contract('ArtifactRegistry', async accounts => {
  const creator = accounts[0];
  const recipient = accounts[1];
  const anotherAccount = accounts[2];

  beforeEach(async function () {
    this.token = await ERC20Eurs.new({ from: creator });
  });

  shouldBehaveLikeERC20('ERC20', toBN(1000000 * (10 ** 4)), creator, recipient, anotherAccount);
});
