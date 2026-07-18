import { Tldraw, DefaultToolbar, TldrawUiMenuItem, useEditor } from 'tldraw'
import 'tldraw/tldraw.css'
import { PendonShapeUtil } from './pendon/canvas/tldraw/PendonShapeUtil'
import { PendonTool } from './pendon/canvas/tldraw/PendonTool'
import { PendonContextMenu } from './pendon/ui/ContextMenu'

const customShapeUtils = [PendonShapeUtil]
const customTools = [PendonTool]

const uiOverrides = {
  tools(editor: any, tools: any) {
    tools.pendon = {
      id: 'pendon',
      icon: 'tool-note',
      label: 'Pendon Note',
      kbd: 'p',
      onSelect: () => editor.setCurrentTool('pendon'),
    }
    return tools
  },
}

function CustomToolbar() {
  const editor = useEditor()
  const isSelected = editor.getCurrentToolId() === 'pendon'

  return (
    <DefaultToolbar>
      <TldrawUiMenuItem
        id="pendon"
        label="Pendon Note"
        icon="tool-note"
        readonlyOk
        isSelected={isSelected}
        onSelect={() => { editor.setCurrentTool('pendon'); }}
      />
    </DefaultToolbar>
  )
}

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw 
        shapeUtils={customShapeUtils} 
        tools={customTools}
        overrides={uiOverrides}
        components={{ 
          ContextMenu: PendonContextMenu,
          Toolbar: CustomToolbar 
        }} 
      />
    </div>
  )
}

export default App;