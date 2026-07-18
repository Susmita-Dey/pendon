import { DefaultContextMenu, TldrawUiMenuGroup, TldrawUiMenuItem, useEditor } from 'tldraw';
import { registry } from '../engine/registry';

export function PendonContextMenu(props: any) {
  const editor = useEditor();
  const selectedShapes = editor.getSelectedShapes();

  if (selectedShapes.length === 1 && (selectedShapes[0].type as string) === 'pendon') {
    const shape = selectedShapes[0] as any;
    const currentBehaviorId = shape.props.behavior.id;
    
    // Get all behaviors except the currently active one
    const availableBehaviors = registry.getAll().filter(b => b.id !== currentBehaviorId);

    return (
      <DefaultContextMenu {...props}>
        {availableBehaviors.length > 0 && (
          <TldrawUiMenuGroup id="pendon-morph">
            {availableBehaviors.map(behavior => (
              <TldrawUiMenuItem
                key={behavior.id}
                id={`morph-to-${behavior.id}`}
                label={`Morph to ${behavior.metadata.label}`}
                onSelect={() => {
                  let newState = behavior.defaultState();
                  
                  if (behavior.convertFrom) {
                    newState = behavior.convertFrom({
                      previousBehaviorId: currentBehaviorId,
                      previousState: shape.props.behaviorState,
                      editor
                    });
                  }
                  
                  editor.updateShape({
                    id: shape.id,
                    type: 'pendon',
                    props: {
                      behavior: { id: behavior.id, version: behavior.version },
                      behaviorState: newState
                    }
                  } as any);
                }}
              />
            ))}
          </TldrawUiMenuGroup>
        )}
      </DefaultContextMenu>
    );
  }

  // Fallback to the default context menu for all other shapes
  return <DefaultContextMenu {...props} />;
}
