import { Editor } from 'tldraw';
import type { PendonShape } from './PendonShape';
import React from 'react';

export interface BehaviorMetadata {
  label: string;
  description: string;
  icon?: string;
}

export interface BehaviorRenderProps<TState> {
  shape: PendonShape;
  state: TState;
  isEditing: boolean;
  updateState: (partialState: Partial<TState>) => void;
  updateText: (text: string) => void;
}

export interface PendonBehavior<TState = unknown> {
  id: string;
  version: number;
  metadata: BehaviorMetadata;

  // State management
  defaultState: () => TState;
  
  // Validation and Migration
  validate: (state: unknown) => state is TState;
  migrate?: (state: unknown, fromVersion: number) => TState;
  
  // Lifecycle hooks
  onCreate?: (props: { shape: PendonShape; editor: Editor }) => void;
  onDelete?: (props: { shape: PendonShape; editor: Editor }) => void;
  convertFrom?: (props: { previousBehaviorId: string; previousState: unknown; editor: Editor }) => TState;
  
  // Rendering
  render: (props: BehaviorRenderProps<TState>) => React.ReactNode;
  
  // Context Actions integration (we map to tldraw actions)
  getContextActions?: (state: TState) => any[];
}

export class BehaviorRegistry {
  private behaviors = new Map<string, PendonBehavior<any>>();

  register(behavior: PendonBehavior<any>) {
    this.behaviors.set(behavior.id, behavior);
  }

  get(id: string): PendonBehavior<any> | undefined {
    return this.behaviors.get(id);
  }
  
  getAll(): PendonBehavior<any>[] {
    return Array.from(this.behaviors.values());
  }
}

export const registry = new BehaviorRegistry();
