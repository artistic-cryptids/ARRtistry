import * as EthCrypto from 'eth-crypto';
import { decrypt, encrypt } from '../helper/encrypt';

it('encrypts the plaintext', async () => {
  const plaintext = 'I would like to encrypt this';
  const alice = EthCrypto.createIdentity();
  const bob = EthCrypto.createIdentity();
  expect((await encrypt(bob.publicKey, plaintext)).ciphertext).not.toBe(plaintext);
});

it('can decrypt the plaintext correctly', async () => {
  const plaintext = 'I would like to encrypt this';
  const alice = EthCrypto.createIdentity();
  const bob = EthCrypto.createIdentity();

  const encrypted = await encrypt(bob.publicKey, plaintext);
  expect(await decrypt(bob.privateKey, encrypted)).toBe(plaintext);
});
