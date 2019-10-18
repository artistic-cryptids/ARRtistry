const Users = artifacts.require('Users');

module.exports = function (deployer) {
  deployer.deploy(Users);
};
