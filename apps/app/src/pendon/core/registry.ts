export interface StyleDef {
  id: string;
  label: string;
  background: string;
  border: string;
  shadow: string;
  text: string;
}

export interface ToneDef {
  id: string;
  label: string;
  icon?: string;
  accentColor?: string;
}

export interface ObjectTypeDef {
  id: string;
  label: string;
  fontFamily: string;
  fontWeight: number;
  textAlign: 'left' | 'center' | 'right';
}

export interface PaletteSectionDef {
  id: string;
  label: string;
  icon: string;
  // If undefined, section is always visible
  isVisible?: (node: import('./types').PendonNode) => boolean;
}

class Registry {
  private styles = new Map<string, StyleDef>();
  private tones = new Map<string, ToneDef>();
  private objectTypes = new Map<string, ObjectTypeDef>();
  private paletteSections = new Map<string, PaletteSectionDef>();

  registerStyle(def: StyleDef) { this.styles.set(def.id, def); }
  getStyle(id: string) { return this.styles.get(id); }
  getStyles() { return Array.from(this.styles.values()); }

  registerTone(def: ToneDef) { this.tones.set(def.id, def); }
  getTone(id: string) { return this.tones.get(id); }
  getTones() { return Array.from(this.tones.values()); }

  registerObjectType(def: ObjectTypeDef) { this.objectTypes.set(def.id, def); }
  getObjectType(id: string) { return this.objectTypes.get(id); }
  getObjectTypes() { return Array.from(this.objectTypes.values()); }

  registerPaletteSection(def: PaletteSectionDef) { this.paletteSections.set(def.id, def); }
  getPaletteSections() { return Array.from(this.paletteSections.values()); }
}

export const pluginRegistry = new Registry();

// Pre-register defaults
pluginRegistry.registerStyle({ id: 'paper', label: 'Paper', background: '#FCFCFC', border: 'rgba(0, 0, 0, 0.08)', shadow: 'rgba(0, 0, 0, 0.04)', text: '#1e293b' });
pluginRegistry.registerStyle({ id: 'slate', label: 'Slate', background: '#f8fafc', border: '#e2e8f0', shadow: 'rgba(0, 0, 0, 0.04)', text: '#334155' });
pluginRegistry.registerStyle({ id: 'mint', label: 'Mint', background: '#ecfdf5', border: '#d1fae5', shadow: 'rgba(5, 150, 105, 0.04)', text: '#065f46' });
pluginRegistry.registerStyle({ id: 'sunrise', label: 'Sunrise', background: '#fffbeb', border: '#fef3c7', shadow: 'rgba(217, 119, 6, 0.04)', text: '#92400e' });
pluginRegistry.registerStyle({ id: 'lavender', label: 'Lavender', background: '#faf5ff', border: '#f3e8ff', shadow: 'rgba(147, 51, 234, 0.04)', text: '#6b21a8' });
pluginRegistry.registerStyle({ id: 'night', label: 'Night', background: '#1e293b', border: '#334155', shadow: 'rgba(0, 0, 0, 0.2)', text: '#f8fafc' });

pluginRegistry.registerTone({ id: 'neutral', label: 'Neutral' });
pluginRegistry.registerTone({ id: 'idea', label: 'Idea', icon: '💡', accentColor: '#fbbf24' });
pluginRegistry.registerTone({ id: 'question', label: 'Question', icon: '❓', accentColor: '#a855f7' });
pluginRegistry.registerTone({ id: 'goal', label: 'Goal', icon: '🎯', accentColor: '#ef4444' });
pluginRegistry.registerTone({ id: 'warning', label: 'Warning', icon: '⚠️', accentColor: '#f97316' });
pluginRegistry.registerTone({ id: 'important', label: 'Important', icon: '✨', accentColor: '#3b82f6' });
pluginRegistry.registerTone({ id: 'meeting', label: 'Meeting', icon: '📅', accentColor: '#10b981' });
pluginRegistry.registerTone({ id: 'decision', label: 'Decision', icon: '✅', accentColor: '#22c55e' });

pluginRegistry.registerObjectType({ id: 'note', label: 'Note', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 400, textAlign: 'center' });
pluginRegistry.registerObjectType({ id: 'idea', label: 'Idea', fontFamily: '"Newsreader", serif', fontWeight: 500, textAlign: 'center' });
pluginRegistry.registerObjectType({ id: 'question', label: 'Question', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 500, textAlign: 'center' });
pluginRegistry.registerObjectType({ id: 'decision', label: 'Decision', fontFamily: '"IBM Plex Sans", sans-serif', fontWeight: 600, textAlign: 'center' });
pluginRegistry.registerObjectType({ id: 'quote', label: 'Quote', fontFamily: '"Newsreader", serif', fontWeight: 400, textAlign: 'left' });
pluginRegistry.registerObjectType({ id: 'callout', label: 'Callout', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 500, textAlign: 'left' });
pluginRegistry.registerObjectType({ id: 'frame', label: 'Frame', fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', fontWeight: 600, textAlign: 'left' });
pluginRegistry.registerPaletteSection({ id: 'style', label: 'Appearance', icon: '🎨' });
pluginRegistry.registerPaletteSection({ 
  id: 'type', 
  label: 'Transform', 
  icon: '⚡',
  isVisible: (node) => node.objectTypeId !== 'frame' && node.behavior.id !== 'checklist'
});
pluginRegistry.registerPaletteSection({ 
  id: 'layout', 
  label: 'Layout', 
  icon: '◫',
  isVisible: (node) => node.objectTypeId === 'frame'
});
pluginRegistry.registerPaletteSection({ 
  id: 'checklist_opts', 
  label: 'Checklist Options', 
  icon: '✓',
  isVisible: (node) => node.behavior.id === 'checklist'
});
