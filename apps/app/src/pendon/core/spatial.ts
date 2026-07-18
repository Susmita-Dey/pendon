import type { PendonNode, AlignmentGuide, DistanceIndicator } from './types';

interface SnapResult {
  dx: number;
  dy: number;
  guides: AlignmentGuide[];
  indicators: DistanceIndicator[];
}

export function calculateSnaps(
  draggedNodes: PendonNode[], 
  allNodes: Record<string, PendonNode>, 
  threshold = 8
): SnapResult {
  let snapDx = 0;
  let snapDy = 0;
  const guides: AlignmentGuide[] = [];
  const indicators: DistanceIndicator[] = [];

  // Simple brute-force for < 10k nodes, can be replaced with QuadTree later
  const targetNodes = Object.values(allNodes).filter(n => !draggedNodes.find(d => d.id === n.id));

  // Find bounding box of dragged nodes
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const n of draggedNodes) {
    if (n.x < minX) minX = n.x;
    if (n.y < minY) minY = n.y;
    if (n.x + n.width > maxX) maxX = n.x + n.width;
    if (n.y + n.height > maxY) maxY = n.y + n.height;
  }
  
  const cx = minX + (maxX - minX) / 2;
  const cy = minY + (maxY - minY) / 2;

  let bestXSnap = threshold;
  let bestYSnap = threshold;

  const trySnapX = (targetX: number, draggedX: number, yStart: number, yEnd: number) => {
    const dx = targetX - draggedX;
    if (Math.abs(dx) < Math.abs(bestXSnap)) {
      bestXSnap = dx;
      guides.push({
        id: `v-${targetX}`,
        type: 'vertical',
        x: targetX,
        y: Math.min(yStart, minY),
        length: Math.max(yEnd, maxY) - Math.min(yStart, minY)
      });
    }
  };

  const trySnapY = (targetY: number, draggedY: number, xStart: number, xEnd: number) => {
    const dy = targetY - draggedY;
    if (Math.abs(dy) < Math.abs(bestYSnap)) {
      bestYSnap = dy;
      guides.push({
        id: `h-${targetY}`,
        type: 'horizontal',
        x: Math.min(xStart, minX),
        y: targetY,
        length: Math.max(xEnd, maxX) - Math.min(xStart, minX)
      });
    }
  };

  for (const target of targetNodes) {
    const tCenterX = target.x + target.width / 2;
    const tCenterY = target.y + target.height / 2;

    // Vertical guides (snapping X)
    trySnapX(target.x, minX, target.y, target.y + target.height); // Left to Left
    trySnapX(target.x + target.width, maxX, target.y, target.y + target.height); // Right to Right
    trySnapX(tCenterX, cx, target.y, target.y + target.height); // Center to Center

    // Horizontal guides (snapping Y)
    trySnapY(target.y, minY, target.x, target.x + target.width); // Top to Top
    trySnapY(target.y + target.height, maxY, target.x, target.x + target.width); // Bottom to Bottom
    trySnapY(tCenterY, cy, target.x, target.x + target.width); // Center to Center
  }

  // Filter out guides that aren't the best snap
  const finalGuides = guides.filter(g => {
    if (g.type === 'vertical') return Math.abs(g.x - (minX + bestXSnap)) < 0.1 || Math.abs(g.x - (maxX + bestXSnap)) < 0.1 || Math.abs(g.x - (cx + bestXSnap)) < 0.1;
    return Math.abs(g.y - (minY + bestYSnap)) < 0.1 || Math.abs(g.y - (maxY + bestYSnap)) < 0.1 || Math.abs(g.y - (cy + bestYSnap)) < 0.1;
  });

  return {
    dx: Math.abs(bestXSnap) < threshold ? bestXSnap : 0,
    dy: Math.abs(bestYSnap) < threshold ? bestYSnap : 0,
    guides: finalGuides,
    indicators
  };
}

export function detectNearMisses(draggedNodes: PendonNode[], allNodes: Record<string, PendonNode>, threshold = 20) {
  // Simple detection if nodes are ALMOST aligned but not perfectly
  // We'll return a layout suggestion if they are within `threshold` but > 2px off
  // For simplicity, we just check centers
  const targetNodes = Object.values(allNodes).filter(n => !draggedNodes.find(d => d.id === n.id));
  
  for (const dragged of draggedNodes) {
    const dcx = dragged.x + dragged.width / 2;
    const dcy = dragged.y + dragged.height / 2;

    for (const target of targetNodes) {
      const tcx = target.x + target.width / 2;
      const tcy = target.y + target.height / 2;

      const dx = Math.abs(dcx - tcx);
      const dy = Math.abs(dcy - tcy);

      if (dx > 2 && dx < threshold) {
        return { type: 'align-v' as const, targetIds: [dragged.id, target.id], x: (dcx + tcx) / 2, y: (dcy + tcy) / 2 };
      }
      if (dy > 2 && dy < threshold) {
        return { type: 'align-h' as const, targetIds: [dragged.id, target.id], x: (dcx + tcx) / 2, y: (dcy + tcy) / 2 };
      }
    }
  }

  return null;
}
