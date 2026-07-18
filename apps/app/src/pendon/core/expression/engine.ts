export interface Point {
  x: number;
  y: number;
}

export interface RecognitionResult {
  confidence: number; // 0 to 1
  suggestion: 'frame' | 'thought' | 'connection' | 'formula' | null;
}

export class ExpressionEngine {
  
  public recognizeStroke(points: Point[]): RecognitionResult {
    if (points.length < 5) return { confidence: 0, suggestion: null };

    const minX = Math.min(...points.map(p => p.x));
    const maxX = Math.max(...points.map(p => p.x));
    const minY = Math.min(...points.map(p => p.y));
    const maxY = Math.max(...points.map(p => p.y));
    
    const width = maxX - minX;
    const height = maxY - minY;
    const aspect = width / (height || 1);
    
    const start = points[0];
    const end = points[points.length - 1];
    
    const distanceStartEnd = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const diagonal = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));

    // Circle -> Thought (closed loop, roughly square aspect ratio)
    if (distanceStartEnd < diagonal * 0.3 && aspect > 0.5 && aspect < 2) {
      return { confidence: 0.88, suggestion: 'thought' };
    }

    // Box -> Frame (closed loop, large size, distinct corners - simplified here)
    if (distanceStartEnd < diagonal * 0.3 && (width > 100 || height > 100)) {
      // In a real app we'd check for 4 corners. For now, if it's large and closed:
      return { confidence: 0.92, suggestion: 'frame' };
    }

    // Line / Arrow -> Connection (Start and end are far apart)
    if (distanceStartEnd > diagonal * 0.8 && aspect > 3) {
      return { confidence: 0.95, suggestion: 'connection' };
    }

    // Scribble -> Formula (lots of points, messy aspect)
    if (points.length > 50 && distanceStartEnd > diagonal * 0.3) {
       // This is a proxy for numbers '123'
       return { confidence: 0.45, suggestion: null }; // Wait until better OCR
    }

    return { confidence: 0, suggestion: null };
  }

}

export const expressionEngine = new ExpressionEngine();
