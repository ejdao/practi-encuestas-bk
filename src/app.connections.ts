import { CTM_CONTEXTS, CtmContextType } from '@common/domain/types';
import { ORM_ENTITIES } from './app.entities';
import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
dotenv.config();

const type = 'postgres';
const port = 5432;
const synchronize = false;
const entities = ORM_ENTITIES;

export const DEFAULT_DS = new DataSource({
  username: process.env.DEFAULT_USERNAME_DB,
  password: process.env.DEFAULT_PASS_DB,
  database: process.env.DEFAULT_NAME_DB,
  host: process.env.DEFAULT_HOST_DB,
  synchronize,
  entities,
  type,
  port,
});

const logs = (success: boolean, ctx: string, err?: any): void => {
  if (success) Logger.log(`${ctx} inicia correctamente`);
  else Logger.log(`${ctx} no pudo iniciar, detalles del error => (${err.message})`);
};

export const initializeSources = () => {
  DEFAULT_DS.initialize()
    .then(() => logs(true, CTM_CONTEXTS.DEFAULT.getForHumans()))
    .catch(err => logs(false, CTM_CONTEXTS.DEFAULT.getForHumans(), err));
};

export const switchConn = (context: CtmContextType) => {
  switch (context) {
    case CTM_CONTEXTS.DEFAULT:
      return DEFAULT_DS;
  }
};
