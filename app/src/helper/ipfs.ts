// eslint-disable-next-line
const IpfsClient = require('ipfs-http-client');
// equivalent import statement does not work.

// create a new ipfs client pointing to infura
const ipfs = new IpfsClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
});

export const saveToIPFS = async (files: any, callback: (hash: string) => void): Promise<void> => {
  const responseArray = await ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) });
  console.log(responseArray);
  callback(responseArray[0].hash);
}

export default ipfs;
