import { CtmContextCode, CtmContextType, ctmContextTypeFactory } from '@common/domain/types';
import { ENVIRONMENTS } from 'src/app.environments';
import { RSA_SERVICES } from './rsa.service';
import { jwtDecode } from 'jwt-decode';
import * as jwt from 'jsonwebtoken';

export class AuthToken {
  id: string;
  dcm: string;
  rst: boolean;
  ctx: CtmContextCode;
  iat?: number;
  exp?: number;
}

export class AuthTokenDecoded {
  constructor(
    private id: number,
    private document: string,
    private context: CtmContextType,
    private createdAt: Date,
    private expiredAt: Date
  ) {}

  getId(): number {
    return this.id;
  }

  getDoument(): string {
    return this.document;
  }

  getContext(): CtmContextType {
    return this.context;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getExpiredAt(): Date {
    return this.expiredAt;
  }
}

const _tokenDateToDate = (date: number): Date => {
  const el = new Date(0);
  return new Date(el.setUTCSeconds(date));
};

const decode = (token: string): AuthTokenDecoded => {
  try {
    const tokDecoded: AuthToken = jwtDecode(token);

    return new AuthTokenDecoded(
      RSA_SERVICES.decryptId(tokDecoded.id),
      tokDecoded.dcm,
      ctmContextTypeFactory(tokDecoded.ctx),
      _tokenDateToDate(tokDecoded.iat),
      _tokenDateToDate(tokDecoded.exp)
    );
  } catch (error) {
    throw new Error('Token not found or invalid');
  }
};

export const generate = (pl: {
  usuarioId: number;
  isPasswordReiniciada: boolean;
  documento: string;
  context: CtmContextType;
}) => {
  const payload: AuthToken = {
    id: RSA_SERVICES.encryptId(pl.usuarioId),
    rst: pl.isPasswordReiniciada,
    dcm: pl.documento,
    ctx: pl.context.getCode(),
  };

  return jwt.sign(payload, ENVIRONMENTS.secretKey, { expiresIn: '7d', algorithm: 'HS512' });
};

export const JWT_SERVICES = {
  decode,
  generate,
};
