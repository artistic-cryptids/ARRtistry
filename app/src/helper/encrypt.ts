import * as EthCrypto from 'eth-crypto';

type IpfsEncryptedDocument = EthCrypto.Encrypted;

// Encrypt plaintext with the public key of who we want to be able to decrypt it
export async function encrypt (publicKey: string, plaintext: string): Promise<IpfsEncryptedDocument> {
  return EthCrypto.encryptWithPublicKey(publicKey, plaintext);
}

// Decrypt the encrypted object with the private key corresponding to the public key it was encrypted with
export async function decrypt (privateKey: string, ciphertext: IpfsEncryptedDocument): Promise<string> {
  return EthCrypto.decryptWithPrivateKey(privateKey, ciphertext);
}

// Given a json document to encrypt and a list of public keys of people to encrypt it for,
export async function encryptForIpfs (publicKeys: string[], plaintext: string): Promise<IpfsEncryptedDocument[]> {
  const encrypted: IpfsEncryptedDocument[] = [];
  for (const key of publicKeys) {
    encrypted.push(await encrypt(key, plaintext));
  }
  return encrypted;
}
