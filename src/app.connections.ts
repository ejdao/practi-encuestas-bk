import { DataSource } from 'typeorm';
import { Logger } from '@nestjs/common';
import { ORM_SHARED_ENTITIES } from '@orm/shared';
import { CTM_CONTEXTS, CtmContextType } from '@common/domain/types';

import { ORM_ENTITIES } from './app.entities';

import * as dotenv from 'dotenv';
dotenv.config();

const type = 'postgres';
const port = 5432;
const entities = ORM_ENTITIES;

export const SHARED_DES = new DataSource({
  username: process.env.SHARED_USERNAME_DB,
  password: process.env.SHARED_PASS_DB,
  database: process.env.SHARED_NAME_DB,
  host: process.env.SHARED_HOST_DB,
  synchronize: false,
  entities: ORM_SHARED_ENTITIES,
  type,
  port,
});

export const DEFAULT_DES = new DataSource({
  username: process.env.DEFAULT_USERNAME_DB,
  password: process.env.DEFAULT_PASS_DB,
  database: process.env.DEFAULT_NAME_DB,
  host: process.env.DEFAULT_HOST_DB,
  synchronize: false,
  entities,
  type,
  port,
});

const logs = (success: boolean, ctx: string, err?: any): void => {
  if (success) Logger.log(`${ctx} inicia correctamente`);
  else Logger.log(`${ctx} no pudo iniciar, detalles del error => (${err.message})`);
};

export const initializeSources = () => {
  SHARED_DES.initialize().then(() => logs(true, CTM_CONTEXTS.SHARED.getForHumans())).catch(err => logs(false, CTM_CONTEXTS.SHARED.getForHumans(), err));
  DEFAULT_DES.initialize().then(() => logs(true, CTM_CONTEXTS.DEFAULT.getForHumans())).catch(err => logs(false, CTM_CONTEXTS.DEFAULT.getForHumans(), err));
};

export const switchConn = (context: CtmContextType) => {
  switch (context) {
    case CTM_CONTEXTS.SHARED: return SHARED_DES;
    case CTM_CONTEXTS.DEFAULT: return DEFAULT_DES;
  }
};
