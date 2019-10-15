const Contract = artifacts.require('./VersionResolver.sol');

contract('VersionResolver', async accounts => {
  let instance;

  beforeEach(async () => {
    instance = await Contract.deployed();
  });

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

  it('Should return 0 address and abi on unknown version', async () => {
    const addr = await instance.getAddr('unknown version');
    const abi = await instance.getAbi('unknown version');

    assert.equal(addr, '0x0000000000000000000000000000000000000000');
    assert.equal(abi, 0);
  });

  it('Should resolve to the correct contract for known version', async () => {
    const addr = '0x1234500000000000000000000000000000000001';
    const version = '1.0.0';
    const abi = '{}';

    await instance.releaseVersion(version, abi, addr);

    const addrResult = await instance.getAddr(version);
    const abiResult = await instance.getAbi(version);

    assert.equal(addr, addrResult);
    assert.equal(abi, abiResult);
  });

  it('Should resolve to the latest contract release for latest version', async () => {
    let addr = '0x1234500000000000000000000000000000000001';
    let version = '1.0.0';
    let abi = '{}';

    await instance.releaseVersion(version, abi, addr);

    let addrResult = await instance.getAddr('latest');
    let abiResult = await instance.getAbi('latest');

    assert.equal(addr, addrResult);
    assert.equal(abi, abiResult);

    addr = '0x1234500000000000000000000000000000000001';
    abi = '{different}';
    version = '1.0.1';

    await instance.releaseVersion(version, abi, addr);

    addrResult = await instance.getAddr('latest');
    abiResult = await instance.getAbi('latest');

    assert.equal(addr, addrResult);
    assert.equal(abi, abiResult);
  });

  it('Should resolve always to itself', async () => {
    const resolvedAddr = await instance.addr('0x3b3b57de3b3b57de3b3b57de3b3b57de3b3b57de3b3b57de3b3b57de3b3b57de');

    assert.equal(resolvedAddr, instance.address);
  });
});
