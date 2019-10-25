// import ipfsClient from 'ipfs-http-client';
const ipfsClient = require('ipfs-http-client');

// create a new ipfs client pointing to infura
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
});

// use the ipfs.add method to pin files
export default ipfs;
