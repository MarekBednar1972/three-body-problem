import {SimulationConfig} from './types';
import {Vector3} from 'three';

export const SIMULATION_CONFIG: SimulationConfig = {
	G: 0.1,
	dt: 0.016,
	maxTrajectoryPoints: 100
};

export const INITIAL_BODIES = [
	{
		mass: 1000,
		position: new Vector3(-10, 0, 0),
		velocity: new Vector3(0, 2, 0),  // Increased initial velocity
		color: 0xff0000
	},
	{
		mass: 2000,
		position: new Vector3(10, 0, 0),
		velocity: new Vector3(0, -1.5, 0),  // Increased initial velocity
		color: 0x00ff00
	},
	{
		mass: 1500,
		position: new Vector3(0, 10, 0),
		velocity: new Vector3(1.5, 0, 0),  // Increased initial velocity
		color: 0x0000ff
	}
];