import type { Editor } from 'tldraw';
import type { CanvasRuntime } from '../runtime';
import type { PendonNode } from '../../core/node/types';

export class TldrawRuntime implements CanvasRuntime {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  getNode(id: string): PendonNode | undefined {
    const shape = this.editor.getShape(id as any) as any;
    if (!shape || (shape.type as string) !== 'pendon') return undefined;
    
    return {
      id: shape.id,
      position: { x: shape.x, y: shape.y },
      size: { width: shape.props.w, height: shape.props.h },
      text: shape.props.text,
      behavior: shape.props.behavior,
      behaviorState: shape.props.behaviorState,
      metadata: {}
    };
  }

  updateNode(id: string, partial: Partial<PendonNode>): void {
    const props: any = {};
    if (partial.text !== undefined) props.text = partial.text;
    if (partial.behavior !== undefined) props.behavior = partial.behavior;
    if (partial.behaviorState !== undefined) props.behaviorState = partial.behaviorState;
    if (partial.size !== undefined) {
      props.w = partial.size.width;
      props.h = partial.size.height;
    }
    
    const update: any = { id, type: 'pendon', props };
    if (partial.position !== undefined) {
      update.x = partial.position.x;
      update.y = partial.position.y;
    }

    this.editor.updateShape(update);
  }

  getSelectedNodes(): PendonNode[] {
    return this.editor.getSelectedShapes()
      .filter(s => (s.type as string) === 'pendon')
      .map(shape => this.getNode(shape.id)!)
      .filter(Boolean);
  }
}
