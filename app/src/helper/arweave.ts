import Arweave from 'arweave/web';
import {JWKInterface} from "arweave/web/lib/wallet";
import {ArtworkInfoFields} from "../components/ArtworkInfo";

const arweave = Arweave.init({});
arweave.network.getInfo().then(console.log);

const logBalance = (key: JWKInterface) => {
  return arweave.wallets.jwkToAddress(key).then((address) => {
    arweave.wallets.getBalance(address).then((balance) => {
      console.log(arweave.ar.winstonToAr(balance));
    });
  });
};

export const getArtworkMetadata = async (id: string): Promise<ArtworkInfoFields> => {
  const data = await arweave.transactions.getData(id, {decode: true, string: true});
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

export const logTransactionData = async (id: string) => {
  arweave.transactions.getData(id, {decode: true, string: true}).then(data => {
    console.log(data);
  });
};

export const saveDocumentToArweave = async (file: string, key: JWKInterface): Promise<string> => {
  // Create transaction for data file
  const transaction = await arweave.createTransaction({
    data: file
  }, key);

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
