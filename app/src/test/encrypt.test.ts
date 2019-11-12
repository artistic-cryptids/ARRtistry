import * as EthCrypto from 'eth-crypto';
import { decrypt, encrypt, encryptForIpfs } from '../helper/encrypt';

const plaintext = 'I would like to encrypt this';

it('encrypts the plaintext', async () => {
  const bob = EthCrypto.createIdentity();
  expect((await encrypt(bob.publicKey, plaintext)).ciphertext).not.toBe(plaintext);
});

it('can decrypt the plaintext correctly', async () => {
  const bob = EthCrypto.createIdentity();
  const encrypted = await encrypt(bob.publicKey, plaintext);
  expect(await decrypt(bob.privateKey, encrypted)).toBe(plaintext);
});

it('can encrypt for multiple people', async () => {
  const bob = EthCrypto.createIdentity();
  const charlie = EthCrypto.createIdentity();
  const encrypted = await encryptForIpfs([bob.publicKey, charlie.publicKey], plaintext);

  expect(encrypted.length).toBe(2);
  expect(encrypted[0].ciphertext).not.toBe(plaintext);
  expect(encrypted[1].ciphertext).not.toBe(plaintext);
  expect(encrypted[0].ciphertext).not.toBe(encrypted[1].ciphertext);
});

it('can be decrypted by the correct people', async () => {
  const bob = EthCrypto.createIdentity();
  const charlie = EthCrypto.createIdentity();
  const encrypted = await encryptForIpfs([bob.publicKey, charlie.publicKey], plaintext);

  expect(await decrypt(bob.privateKey, encrypted[0])).toBe(plaintext);
  expect(await decrypt(charlie.privateKey, encrypted[1])).toBe(plaintext);
});
