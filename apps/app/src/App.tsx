import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { PendonShapeUtil } from './pendon/engine/PendonShapeUtil'
import { PendonContextMenu } from './pendon/ui/ContextMenu'

const customShapeUtils = [PendonShapeUtil]

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw shapeUtils={customShapeUtils} components={{ ContextMenu: PendonContextMenu }} />
    </div>
  )
}

export default App;