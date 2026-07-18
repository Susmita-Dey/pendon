import type { ChecklistItem } from '../types';

export function detectChecklistIntent(text: string): boolean {
  if (!text) return false;
  
  const trimmed = text.trim();
  
  // Rule 1: Starts with TODO (case-insensitive)
  if (trimmed.toLowerCase().startsWith('todo')) {
    return true;
  }
  
  // Rule 2: Contains lines starting with empty bracket variants
  const lines = text.split('\n');
  let bracketCount = 0;
  for (const line of lines) {
    const t = line.trim();
    if (t.startsWith('[]') || t.startsWith('[ ]') || t.startsWith('[x]') || t.startsWith('[X]')) {
      bracketCount++;
    }
  }
  
  return bracketCount > 0;
}

export function detectPlainThoughtIntent(items: ChecklistItem[]): boolean {
    if (items.length === 0) return true;
    return items.every(item => item.text.trim() === '');
}

export function textToChecklist(text: string): { items: ChecklistItem[] } {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  const items: ChecklistItem[] = [];
  
  let idCounter = Date.now();
  
  for (let line of lines) {
    if (line.toLowerCase() === 'todo') continue; // Skip header
    
    let checked = false;
    
    // Parse brackets
    if (line.startsWith('[]')) {
      line = line.substring(2).trim();
    } else if (line.startsWith('[ ]')) {
      line = line.substring(3).trim();
    } else if (line.startsWith('[x]') || line.startsWith('[X]')) {
      checked = true;
      line = line.substring(3).trim();
    }
    
    items.push({
      id: `item-${idCounter++}-${Math.random().toString(36).substr(2, 6)}`,
      text: line,
      checked
    });
  }
  
  // If parsing resulted in nothing but we had a TODO, give them an empty item
  if (items.length === 0) {
    items.push({
      id: `item-${Date.now()}`,
      text: '',
      checked: false
    });
  }
  
  return { items };
}

export function checklistToText(items: ChecklistItem[]): string {
    if (items.length === 0) return '';
    return items.map(item => item.text).join('\n');
}
