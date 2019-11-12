import * as EthCrypto from 'eth-crypto';

// Encrypt plaintext with the public key of who we want to be able to decrypt it
export async function encrypt (publicKey: string, plaintext: string): Promise<EthCrypto.Encrypted> {
  return EthCrypto.encryptWithPublicKey(publicKey, plaintext);
}

// Decrypt the encrypted object with the private key corresponding to the public key it was encrypted with
export async function decrypt (privateKey: string, ciphertext: EthCrypto.Encrypted): Promise<string> {
  return EthCrypto.decryptWithPrivateKey(privateKey, ciphertext);
}
