const Governance = artifacts.require('Governance');

module.exports = async (deployer, network, accounts) => {
  deployer
    .then(async () => {
      let newModerator;

      // The owner key should be stored securely in cold storage.
      switch (network) {
      case 'development':
      case 'test':
      case 'coverage':
      case 'ganache':
        newModerator = accounts[1];
        break;
      case 'ropsten':
      case 'rinkeby':
        // newModerator = '0xA7899114e93880A5790a68F9df66174FC038849a'
        break;
      default:
        throw new Error('No ownership transfer defined for this network');
      }

      console.log('Transferring ownership');
      const governance = await Governance.deployed();

      console.log('Transferring governance ownership to', newModerator);
      await governance.transferOwnership(newModerator);

      console.log('Transferring governance moderatorship to', newModerator);
      await governance.setModerator(newModerator);
    })
    .catch((error) => {
      console.error(error);

      throw error;
    });
};
