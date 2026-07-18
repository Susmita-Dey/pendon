import type { PendonNode } from '../node/types';
import type React from 'react';

export interface BehaviorCapabilities {
  editable: boolean;
  resizable: boolean;
  supportsChildren: boolean;
  supportsConnections: boolean;
  searchable: boolean;
}

export interface BehaviorMetadata {
  label: string;
  description: string;
  icon?: string;
}

export interface BehaviorLogic<TState = unknown> {
  defaultState: () => TState;
  validate: (state: unknown) => state is TState;
  
  serialize?: (state: TState) => string;
  deserialize?: (data: string) => TState;
  migrate?: (state: unknown, fromVersion: number) => TState;
  
  onCreate?: (node: PendonNode) => TState;
  convertFrom?: (previousBehaviorId: string, previousState: unknown) => TState;
}

export interface BehaviorViewProps<TState = unknown> {
  node: PendonNode;
  state: TState;
  isEditing: boolean;
  updateState: (partialState: Partial<TState>) => void;
  updateText: (text: string) => void;
  morphTo: (targetBehaviorId: string) => void;
}

export interface BehaviorPlugin<TState = unknown> {
  id: string;
  version: number;
  metadata: BehaviorMetadata;
  capabilities: BehaviorCapabilities;
  logic: BehaviorLogic<TState>;
  view: React.ComponentType<BehaviorViewProps<TState>>;
}
