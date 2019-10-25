// eslint-disable-next-line
const ipfsClient = require('ipfs-http-client');
// equivalent import statement does not work.

// create a new ipfs client pointing to infura
const ipfs = new ipfsClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
});

// use the ipfs.add method to pin files
export default ipfs;
