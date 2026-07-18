import type { BehaviorLogic } from '../../core/behavior/types';
import type { PlainState } from './types';

export const logic: BehaviorLogic<PlainState> = {
  defaultState: () => ({ _brand: 'plain' }),
  validate: (state: unknown): state is PlainState => {
    return typeof state === 'object' && state !== null && '_brand' in state && (state as any)._brand === 'plain';
  },
  convertFrom: () => {
    return { _brand: 'plain' };
  }
};
