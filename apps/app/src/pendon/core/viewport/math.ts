import type { Camera } from '../types';

export function screenToWorkspace(screenX: number, screenY: number, camera: Camera) {
  return {
    x: (screenX - camera.x) / camera.z,
    y: (screenY - camera.y) / camera.z,
  };
}

export function workspaceToScreen(worldX: number, worldY: number, camera: Camera) {
  return {
    x: worldX * camera.z + camera.x,
    y: worldY * camera.z + camera.y,
  };
}
