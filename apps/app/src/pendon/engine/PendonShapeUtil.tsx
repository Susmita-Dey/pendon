import { ShapeUtil, Rectangle2d, T, type RecordProps } from 'tldraw';
import type { PendonShape, PendonShapeProps } from './PendonShape';
import { registry } from './registry';
import { plainBehavior } from '../behaviors/plain';

// Register the default behavior
registry.register(plainBehavior);

export class PendonShapeUtil extends ShapeUtil<any> {
  static type = 'pendon' as const;

  // tldraw requires prop validators
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
    return {
      text: '',
      behavior: { id: plainBehavior.id, version: plainBehavior.version },
      behaviorState: plainBehavior.defaultState(),
      w: 200,
      h: 200,
    };
  }

  getGeometry(shape: PendonShape) {
    return new Rectangle2d({ width: shape.props.w, height: shape.props.h, isFilled: true });
  }

  component(shape: PendonShape) {
    const behavior = registry.get(shape.props.behavior.id);
    const activeBehavior = behavior || plainBehavior;
    
    let state = shape.props.behaviorState;
    
    // Migrate & Validate
    if (shape.props.behavior.version < activeBehavior.version && activeBehavior.migrate) {
      state = activeBehavior.migrate(state, shape.props.behavior.version);
    }
    if (!activeBehavior.validate(state)) {
      console.warn(`[Pendon] Invalid state for behavior ${activeBehavior.id}, falling back to default.`);
      state = activeBehavior.defaultState();
    }

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

    return activeBehavior.render({
      shape,
      state: state as any,
      isEditing: this.editor.getEditingShapeId() === shape.id,
      updateState,
      updateText
    });
  }

  indicator(shape: any) {
    return <rect width={shape.props.w} height={shape.props.h} rx={8} ry={8} />;
  }

  getIndicatorPath(_shape: any): any {
    return undefined;
  }
}
