import { __ENC__TBL_NMS__ } from './encuestas';
import { __GEN__TBL_NMS__ } from './general';
import { __SRD__TBL_NMS__ } from './shared';

export const TABLE_NAMES = {
  shared: __SRD__TBL_NMS__,
  general: __GEN__TBL_NMS__,
  ...__ENC__TBL_NMS__,
};
