const Users = artifacts.require('Users');

contract('Users', async accounts => {
  let instance;
  const mainAccount = accounts[0];

  // TEST: register a new user and check if the total users is increased and if the
  // user has been registered correctly.
  it('should register an user', async () => {
    instance = await Users.deployed();
    const totalUsersBeforeRegister = await instance.totalUsers.call();
    const initialTotal = totalUsersBeforeRegister.toNumber();

    await instance.registerUser('Test User Name', web3.utils.fromAscii('Test Status'), {
      from: mainAccount,
    });
    const totalUsersAfterRegister = await instance.totalUsers.call();

    assert.equal(
      totalUsersAfterRegister.toNumber(),
      initialTotal + 1,
      'number of users must be (' + initialTotal + ' + 1)'
    );

    const isMainAccountRegistered = await instance.isRegistered.call({ from: mainAccount });
    assert.isTrue(isMainAccountRegistered);
  }); // end of "should register an user"

  // Testing the data of the user profile stored in the blockchain match with the data
  // gave during the registration.
  it('username and status in the blockchain should be the same the one gave on the registration', async () => {
    // NOTE: the contract instance has been instantiated before, so no need
    // to do again: return Users.deployed().then(function(contractInstance) { ...
    // like before in "should register an user".
    const profile = await instance.getOwnProfile.call();
    // the result is an array where in the position 0 there user ID, in
    // the position 1 the user name and in the position 2 the status,
    assert.equal(profile[1], 'Test User Name');

    // the status is type of bytes32: converting the status Bytes32 into string
    const newStatusStr = web3.utils.toUtf8(profile[2]);
    assert.equal(newStatusStr, 'Test Status');
  }); // end testing username and status

  // Testing the update profile function: first update the user's profile name and status, then
  // chching that the profile has been updated correctly.
  it('should update the profile', function () {
    return instance.updateUser('Updated Name', web3.utils.fromAscii('Updated Status'), {
      from: mainAccount,
    }).then(function (result) {
      return instance.getOwnProfile.call();
    }).then(function (result) {
      // the result is an array where in the position 0 there user ID, in
      // the position 1 the user name and in the position 2 the status,
      assert.equal(result[1], 'Updated Name');

      // the status is type of bytes32: converting the status Bytes32 into string
      const newStatusStr = web3.utils.toUtf8(result[2]);
      assert.equal(newStatusStr, 'Updated Status');
    });
  }); // end should update the profile

  // Testing that a user cannot register itself twice.
  it('a registered user should not be registered twice', function () {
    // we are expecting the call to registerUser to fail since the user account
    // is already registered!
    return instance.registerUser('Test username Twice', web3.utils.fromAscii('Test Status Twice'), {
      from: mainAccount,
    }).then(assert.fail).catch(function (error) { // here we are expecting the exception
      if (error) {
        assert(true);
      }
    });
  }); // end testing registration twice
}); // end Users contract
