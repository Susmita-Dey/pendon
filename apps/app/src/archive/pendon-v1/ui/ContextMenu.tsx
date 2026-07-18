import { DefaultContextMenu, TldrawUiMenuGroup, TldrawUiMenuItem, useEditor } from 'tldraw';
import { registry } from '../core/registry/registry';
import { TldrawRuntime } from '../canvas/tldraw/TldrawRuntime';


export function PendonContextMenu(props: any) {
  const editor = useEditor();
  const runtime = new TldrawRuntime(editor);
  
  const selectedNodes = runtime.getSelectedNodes();

  if (selectedNodes.length === 1) {
    const node = selectedNodes[0];
    const currentBehaviorId = node.behavior.id;
    
    const availablePlugins = registry.getAll().filter(b => b.id !== currentBehaviorId);

    return (
      <DefaultContextMenu {...props}>
        {availablePlugins.length > 0 && (
          <TldrawUiMenuGroup id="pendon-morph">
            {availablePlugins.map(plugin => (
              <TldrawUiMenuItem
                key={plugin.id}
                id={`morph-to-${plugin.id}`}
                label={`Morph to ${plugin.metadata.label}`}
                onSelect={() => {
                  let newState = plugin.logic.defaultState();
                  
                  if (plugin.logic.convertFrom) {
                    newState = plugin.logic.convertFrom(currentBehaviorId, node.behaviorState);
                  }
                  
                  runtime.updateNode(node.id, {
                    behavior: { id: plugin.id, version: plugin.version },
                    behaviorState: newState
                  });
                }}
              />
            ))}
          </TldrawUiMenuGroup>
        )}
      </DefaultContextMenu>
    );
  }

  return <DefaultContextMenu {...props} />;
}
