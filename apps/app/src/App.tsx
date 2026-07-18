import { Tldraw } from 'tldraw'
import 'tldraw/tldraw.css'
import { PendonShapeUtil } from './pendon/engine/PendonShapeUtil'

const customShapeUtils = [PendonShapeUtil]

function App() {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw shapeUtils={customShapeUtils} />
    </div>
  )
}

export default App;