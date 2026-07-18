import type { BehaviorLogic } from '../../core/behavior/types';
import type { FormulaState } from './types';

export const logic: BehaviorLogic<FormulaState> = {
  defaultState: () => ({ _brand: 'formula' }),
  validate: (state: unknown): state is FormulaState => {
    return typeof state === 'object' && state !== null && '_brand' in state && (state as any)._brand === 'formula';
  },
  convertFrom: () => {
    return { _brand: 'formula' };
  }
};
