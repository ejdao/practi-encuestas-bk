import { ENVIRONMENTS } from 'src/app.environments';
import * as NodeRSA from 'node-rsa';
import * as dotenv from 'dotenv';
dotenv.config();

const encryptId = (id: number): string => {
  if (ENVIRONMENTS.production) {
    const keyPublic = ENVIRONMENTS.rsa.ids.publicKey;
    let encrypted = keyPublic.encrypt(`${id}`, 'base64');
    encrypted = encrypted.replaceAll('+', '_').replaceAll('/', '.');
    return encrypted;
  } else {
    return `${id}`;
  }
};

const decryptId = (encryptedId: string): number => {
  const idIsNumber = !isNaN(+encryptedId);
  if (idIsNumber) return +encryptedId;
  encryptedId = encryptedId.replaceAll('_', '+').replaceAll('.', '/');
  const keyPrivate = ENVIRONMENTS.rsa.ids.privateKey;
  const decrypt = keyPrivate.decrypt(encryptedId, 'utf8');
  return +decrypt;
};

const generateKeys = () => {
  const keys = new NodeRSA({ b: 512 });
  const publicKey = keys.exportKey('public');
  const privateKey = keys.exportKey('private');
  return { publicKey, privateKey };
};

export const RSA_SERVICES = {
  encryptId,
  decryptId,
  generateKeys,
};
