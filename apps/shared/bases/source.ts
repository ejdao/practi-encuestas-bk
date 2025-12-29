import { Raw } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CTM_CONTEXTS } from '@common/domain/types';
import { STRING_UTILITIES } from '@common/application/services';
import { switchConn } from 'src/app.connections';

@Injectable()
export class SharedBaseSource {
  protected conn = switchConn(CTM_CONTEXTS.SHARED);

  like(pattern: string) {
    return pattern
      ? Raw(value => `LOWER(${value}) Like '%${STRING_UTILITIES.lowerCaseAndTrim(pattern)}%'`)
      : undefined;
  }

  take(pattern: string, take = 5) {
    return pattern ? take : undefined;
  }
}
