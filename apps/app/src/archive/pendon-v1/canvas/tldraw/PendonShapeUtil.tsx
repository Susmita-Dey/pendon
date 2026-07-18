
import { ShapeUtil, HTMLContainer, Rectangle2d, T, type RecordProps } from 'tldraw';
import type { PendonShape, PendonShapeProps } from './PendonShape';
import { registry } from '../../core/registry/registry';
import { plainBehavior } from '../../behaviors/plain';
import { formulaBehavior } from '../../behaviors/formula';
import type { PendonNode } from '../../core/node/types';

// Register plugins globally for now
registry.register(plainBehavior);
registry.register(formulaBehavior);

export class PendonShapeUtil extends ShapeUtil<any> {
  static type = 'pendon' as const;

  static props: RecordProps<PendonShape> = {
    text: T.string,
    behavior: T.object({
      id: T.string,
      version: T.number,
    }),
    behaviorState: T.any,
    w: T.number,
    h: T.number,
  };

  getDefaultProps(): PendonShapeProps {
    const defaultPlugin = registry.get('plain') || plainBehavior;
    return {
      text: '',
      behavior: { id: defaultPlugin.id, version: defaultPlugin.version },
      behaviorState: defaultPlugin.logic.defaultState(),
      w: 200,
      h: 200,
    };
  }

  getGeometry(shape: any) {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true });
  }

  component(shape: any) {
    console.log('[PendonShapeUtil] Rendering shape:', shape.id, shape.type, shape.props);
    const plugin = registry.get(shape.props.behavior.id) || registry.get('plain') || plainBehavior;
    
    let state = shape.props.behaviorState;
    const { logic, view: View } = plugin;
    
    // Migrate & Validate
    if (shape.props.behavior.version < plugin.version && logic.migrate) {
      state = logic.migrate(state, shape.props.behavior.version);
    }
    if (!logic.validate(state)) {
      console.warn(`[Pendon] Invalid state for behavior ${plugin.id}, falling back to default.`);
      state = logic.defaultState();
    }

    // Convert TL shape to PendonNode
    const node: PendonNode = {
      id: shape.id,
      position: { x: shape.x, y: shape.y },
      size: { width: shape.props.w, height: shape.props.h },
      text: shape.props.text,
      behavior: shape.props.behavior,
      behaviorState: state,
      metadata: {}
    };

    const updateState = (partial: any) => {
      this.editor.updateShape({
        id: shape.id,
        type: 'pendon',
        props: {
          behaviorState: { ...(state as any), ...partial }
        }
      } as any);
    };

    const updateText = (text: string) => {
      this.editor.updateShape({
        id: shape.id,
        type: 'pendon',
        props: { text }
      } as any);
    };

    const morphTo = (targetBehaviorId: string) => {
      const targetPlugin = registry.get(targetBehaviorId);
      if (!targetPlugin) return;

      let newState = targetPlugin.logic.defaultState();
      if (targetPlugin.logic.convertFrom) {
        newState = targetPlugin.logic.convertFrom(shape.props.behavior.id, state);
      }

      this.editor.updateShape({
        id: shape.id,
        type: 'pendon',
        props: {
          behavior: { id: targetPlugin.id, version: targetPlugin.version },
          behaviorState: newState
        }
      } as any);
    };

    return (
      <HTMLContainer id={shape.id}>
        <div style={{ width: shape.props.w, height: shape.props.h, display: 'flex' }}>
          <View
            node={node}
            state={state as any}
            isEditing={this.editor.getEditingShapeId() === shape.id}
            updateState={updateState}
            updateText={updateText}
            morphTo={morphTo}
          />
        </div>
      </HTMLContainer>
    );
  }

  indicator(shape: any) {
    return <rect width={shape.props.w} height={shape.props.h} rx={8} ry={8} />;
  }

  getIndicatorPath(_shape: any): any {
    return undefined;
  }
}
