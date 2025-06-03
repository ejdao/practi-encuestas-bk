import { Injectable } from '@nestjs/common';
import { CTM_CONTEXTS } from '@common/domain/types';
import { switchConn } from 'src/app.connections';

@Injectable()
export class UbicacionBaseSource {
  protected conn = switchConn(CTM_CONTEXTS.SHARED);
}
