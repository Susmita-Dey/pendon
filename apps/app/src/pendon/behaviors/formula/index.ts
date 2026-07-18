import type { PendonBehavior } from '../../engine/registry';
import type { FormulaState } from './types';
import { FormulaRender } from './render';

function calculateTotal(text: string): number {
  // Simple formula logic: sum all numbers found in the text
  const numbers = text.match(/-?\d+(\.\d+)?/g);
  if (!numbers) return 0;
  return numbers.reduce((sum, num) => sum + parseFloat(num), 0);
}

export const formulaBehavior: PendonBehavior<FormulaState> = {
  id: 'formula',
  version: 1,
  metadata: {
    label: 'Formula',
    description: 'Calculates a live total from numbers in the text.',
  },
  defaultState: () => ({ _brand: 'formula' }),
  validate: (state: unknown): state is FormulaState => {
    return typeof state === 'object' && state !== null && '_brand' in state && (state as any)._brand === 'formula';
  },
  convertFrom: () => {
    // We don't need to migrate any previous state into Formula's state,
    // the text is preserved implicitly in the shape props.
    return { _brand: 'formula' };
  },
  render: (props) => {
    // Derive the live total directly from the shape's text for rendering
    const total = calculateTotal(props.shape.props.text);
    return FormulaRender({ ...props, state: { ...props.state, total } });
  }
};
