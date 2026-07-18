import type { BehaviorPlugin } from '../behavior/types';

export class BehaviorRegistry {
  private behaviors = new Map<string, BehaviorPlugin<any>>();

  register(behavior: BehaviorPlugin<any>) {
    this.behaviors.set(behavior.id, behavior);
  }

  get(id: string): BehaviorPlugin<any> | undefined {
    return this.behaviors.get(id);
  }
  
  getAll(): BehaviorPlugin<any>[] {
    return Array.from(this.behaviors.values());
  }
}

export const registry = new BehaviorRegistry();
