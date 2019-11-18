// eslint-disable-next-line
const IpfsClient = require('ipfs-http-client');
// equivalent import statement does not work.

// create a new ipfs client pointing to infura
export const ipfs = new IpfsClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
});

export async function saveArtifactToIpfs (files: any, afterwardsFunction: (arg0: string) => void): Promise<void> {
  await ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
    .then((response: any) => {
      afterwardsFunction(response);
    }).catch((err: any) => {
      console.log(err);
    });
}

export async function saveArtistToIpfs (files: any, afterwardsFunction: (arg0: string) => void): Promise<void> {
  let ipfsId: string;
  await ipfs.add([...files], { progress: (prog: any) => console.log(`received: ${prog}`) })
    .then((response: any) => {
      ipfsId = response[0].hash;
      afterwardsFunction(ipfsId);
    }).catch((err: any) => {
      console.log(err);
    });
}
