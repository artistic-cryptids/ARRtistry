import * as IPFS from './ipfs';
import * as Arweave from './arweave';
import { ArtworkInfoFields } from '../components/ArtworkInfo';
import { JWKInterface } from 'arweave/web/lib/wallet';
import { User } from '../providers/SessionProvider';

export const getArtworkMetadata = async (metaUri: string): Promise<ArtworkInfoFields> => {
  if (metaUri.includes('ipfs') || metaUri.includes('http')) {
    return IPFS.getArtworkMetadata(metaUri);
  }
  return Arweave.getArtworkMetadata(metaUri);
};

export const getUserListMetadata = async (metaUri: string): Promise<Array<User>> => {
  if (metaUri.includes('ipfs') || metaUri.includes('http')) {
    return IPFS.getUserListMetadata(metaUri);
  }
  return Arweave.getUserListMetadata(metaUri);
};

export const saveMetadata = async (jsonData: string | object, key?: JWKInterface): Promise<string> => {
  if (typeof jsonData === 'object') {
    jsonData = JSON.stringify(jsonData);
  }

  if (key) {
    return Arweave.saveDocumentToArweave(jsonData, key);
  }

  return 'https://ipfs.io/ipfs/' + await IPFS.saveSingleToIPFSNoCallBack(jsonData);
};
