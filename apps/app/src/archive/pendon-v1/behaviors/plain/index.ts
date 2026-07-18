import type { BehaviorPlugin } from '../../core/behavior/types';
import type { PlainState } from './types';
import { logic } from './logic';
import { PlainView } from './view';

export const plainBehavior: BehaviorPlugin<PlainState> = {
  id: 'plain',
  version: 1,
  metadata: {
    label: 'Plain Note',
    description: 'A simple text note.',
  },
  capabilities: {
    editable: true,
    resizable: true,
    supportsChildren: false,
    supportsConnections: true,
    searchable: true,
  },
  logic,
  view: PlainView,
};
