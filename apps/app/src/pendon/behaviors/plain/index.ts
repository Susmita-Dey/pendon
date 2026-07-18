import type { PendonBehavior } from '../../engine/registry';
import type { PlainState } from './types';
import { PlainRender } from './render';

export const plainBehavior: PendonBehavior<PlainState> = {
  id: 'plain',
  version: 1,
  metadata: {
    label: 'Plain Note',
    description: 'A simple text note.',
  },
  defaultState: () => ({ _brand: 'plain' }),
  validate: (state: unknown): state is PlainState => {
    return typeof state === 'object' && state !== null && '_brand' in state && (state as any)._brand === 'plain';
  },
  render: PlainRender,
};
