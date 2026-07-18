import { BaseBoxShapeTool } from 'tldraw';

export class PendonTool extends BaseBoxShapeTool {
  static id = 'pendon';
  static initial = 'idle';
  override shapeType = 'pendon' as any;
}
