import type { BehaviorPlugin } from '../../core/behavior/types';
import type { FormulaState } from './types';
import { logic } from './logic';
import { FormulaView } from './view';

export const formulaBehavior: BehaviorPlugin<FormulaState> = {
  id: 'formula',
  version: 1,
  metadata: {
    label: 'Formula',
    description: 'Calculates a live total from numbers in the text.',
  },
  capabilities: {
    editable: true,
    resizable: true,
    supportsChildren: false,
    supportsConnections: true,
    searchable: true,
  },
  logic,
  view: FormulaView,
};
