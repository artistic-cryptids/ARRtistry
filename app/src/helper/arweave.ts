import Arweave from 'arweave/web';
import { JWKInterface } from 'arweave/web/lib/wallet';
import { ArtworkInfoFields } from '../components/ArtworkInfo';

const arweave = Arweave.init({});
arweave.network.getInfo().then(console.log).catch(console.error);

export const getBasename = (path: string): string => path.substr(0, path.indexOf('/', 1));

export const getArtworkMetadata = async (id: string): Promise<ArtworkInfoFields> => {
  const data = await arweave.transactions.getData(id, { decode: true, string: true });
  console.log(data);
  if (typeof data === 'string') {
    return JSON.parse(data);
  }

  return {
    name: '',
    artistId: 0,
    description: '',
    edition: '',
    artifactCreationDate: '',
    medium: '',
    width: '',
    height: '',
    image: '',
    documents: [],
  };
};

export const saveDocumentToArweave = async (file: string, key: JWKInterface): Promise<string> => {
  // Create transaction for data file
  const transaction = await arweave.createTransaction({ data: file }, key);

  // TODO: Add tags for different doc types
  transaction.addTag('Content-Type', 'text/plain');

  // Sign with key
  await arweave.transactions.sign(transaction, key);
  console.log(transaction);

  // Submit with key
  const response = await arweave.transactions.post(transaction);
  console.log(response);

  // Example return: jnjXgn4GpKNXyHajtkIZLHF7pYWRjwMrhEKmded0Z9A
  return transaction.id;
};
