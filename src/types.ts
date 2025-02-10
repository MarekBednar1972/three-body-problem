// src/types.ts
import { Vector3 } from 'three';

export interface Body {
  mass: number;
  position: Vector3;
  velocity: Vector3;
  acceleration: Vector3;
}

export interface VisualBody {
  physical: Body;
  mesh: THREE.Mesh;
  trajectory: {
    line: THREE.Line;
    positions: Vector3[];
  };
}

export interface SimulationConfig {
  G: number;  // Gravitational constant
  dt: number; // Time step
  maxTrajectoryPoints: number;
}