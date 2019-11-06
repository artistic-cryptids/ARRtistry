// eslint-disable-next-line
const IpfsClient = require('ipfs-http-client');
// equivalent import statement does not work.

// create a new ipfs client pointing to infura
const ipfs = new IpfsClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
});

export default ipfs;
