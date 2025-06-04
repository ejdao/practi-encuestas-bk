import { ENVIRONMENTS } from 'src/app.environments';
import * as NodeRSA from 'node-rsa';
import * as dotenv from 'dotenv';
dotenv.config();

const encryptId = (id: number) => {
  if (ENVIRONMENTS.rsa.isActive) {
    if (typeof id === 'number') {
      if (ENVIRONMENTS.production) {
        const keyPublic = ENVIRONMENTS.rsa.ids.publicKey;
        let encrypted = keyPublic.encrypt(`${id}`, 'base64');
        encrypted = encrypted.replaceAll('+', '_').replaceAll('/', '.');
        return encrypted;
      } else {
        return `${id}`;
      }
    } else {
      return id as any;
    }
  } else {
    return id as any;
  }
};

const decryptId = (encryptedId: string) => {
  if (ENVIRONMENTS.rsa.isActive) {
    if (typeof encryptedId === 'string') {
      const idIsNumber = !isNaN(+encryptedId);
      if (idIsNumber) return +encryptedId;
      encryptedId = encryptedId.replaceAll('_', '+').replaceAll('.', '/');
      const keyPrivate = ENVIRONMENTS.rsa.ids.privateKey;
      const decrypt = keyPrivate.decrypt(encryptedId, 'utf8');
      return +decrypt;
    } else {
      return encryptedId as any;
    }
  } else {
    return encryptedId;
  }
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
