const Governance = artifacts.require('Governance');
const ArtifactRegistry = artifacts.require('ArtifactRegistry');
const RoyaltyDistributor = artifacts.require('RoyaltyDistributor');

module.exports = async (deployer, network, accounts) => {
  deployer
    .then(async () => {
      let oldModerator;
      let newModerator;

      // The owner key should be stored securely in cold storage.
      switch (network) {
      case 'development':
      case 'test':
      case 'soliditycoverage':
      case 'ganache':
        oldModerator = accounts[0];
        newModerator = accounts[1];
        break;
      case 'rinkeby':
      case 'rinkeby-fork':
        oldModerator = process.env.ACCOUNT_ADDRESS;
        newModerator = process.env.ACCOUNT_ADDRESS;
        break;
      default:
        throw new Error('No ownership transfer defined for this network');
      }

      console.log('Transferring ownership');
      const governance = await Governance.deployed();

      console.log('Transferring governance ownership to', newModerator);
      await governance.transferOwnership(newModerator, { from: oldModerator });

      console.log('Adding governance moderatorship for', newModerator);
      await governance.addModerator(newModerator, { from: oldModerator });

      console.log('Setting Registry ownership to governance');
      const registry = await ArtifactRegistry.deployed();
      await registry.transferOwnership(governance.address);

      const royalty = await RoyaltyDistributor.deployed();
      console.log('Adding Royalty Distributor as ARR Governer', royalty.address);
      await governance.addModerator(royalty.address, { from: oldModerator });
    })
    .catch((error) => {
      console.error(error);

      throw error;
    });
};
