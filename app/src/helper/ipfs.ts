import { ArtworkInfoFields } from '../components/ArtworkInfo';

// eslint-disable-next-line
const IpfsClient = require('ipfs-http-client');
// equivalent import statement does not work.

export const IPFS_URL_START = 'https://ipfs.io/ipfs/';

export interface IpfsResponse {
  hash: string;
}

type Uploadable = (string | ArrayBuffer | null);
type HashCallback = (hash: string) => void;
type ResponseCallback = (response: IpfsResponse[]) => void;
// create a new ipfs client pointing to infura
const ipfs = new IpfsClient({
  host: 'ipfs.infura.io',
  port: '5001',
  protocol: 'https',
});

const progressMonitor = (prog: number): void => console.log(`received: ${prog}`);

export const getArtworkMetadata = async (url: string): Promise<ArtworkInfoFields> => {
  const response = await fetch(url);
  return response.json();
};

export const saveSingleToIPFS = async (files: Uploadable, callback: HashCallback): Promise<void> => {
  const responseArray = await ipfs.add(files, { progress: progressMonitor });
  if (responseArray.length > 0) {
    callback(responseArray[0].hash);
  } else {
    console.error('IPFS failed to return', responseArray);
  }
};

export const saveSingleToIPFSNoCallBack = async (files: Uploadable): Promise<string> => {
  let responseArray = [];
  while (responseArray.length === 0) {
    responseArray = await ipfs.add(files, { progress: progressMonitor });
  }

  if (responseArray.length > 0) {
    return responseArray[0].hash;
  } else {
    console.error('IPFS failed to return', responseArray);
    return 'saveSingleToIPFS failed';
  }
};

export const saveToIPFS = async (files: Uploadable[], callback: ResponseCallback): Promise<void> => {
  let responseArray = [];
  while (responseArray.length === 0) {
    responseArray = await ipfs.add(files, { progress: progressMonitor });
  }

  if (responseArray.length > 0) {
    callback(responseArray);
  } else {
    console.error('IPFS failed to return', responseArray);
  }
};

export default ipfs;
