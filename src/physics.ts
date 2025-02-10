import {Body} from './types';
import {Vector3} from 'three';
import {SIMULATION_CONFIG} from './config';

export class PhysicsEngine {
	private bodies: Body[];

	constructor(bodies: Body[]) {
		this.bodies = bodies;
	}

	update(): void {
		this.resetAccelerations();
		this.calculateGravitationalForces();
		this.updatePositionsAndVelocities();
	}

	private resetAccelerations(): void {
		this.bodies.forEach(body => {
			body.acceleration.set(0, 0, 0);
		});
	}

	private calculateGravitationalForces(): void {
		const {G} = SIMULATION_CONFIG;

		for (let i = 0; i < this.bodies.length; i++) {
			const bodyA = this.bodies[i];

			for (let j = i + 1; j < this.bodies.length; j++) {
				const bodyB = this.bodies[j];

				// Calculate direction and distance
				const direction = new Vector3()
					.copy(bodyB.position)
					.sub(bodyA.position);

				const distanceSquared = direction.lengthSq();
				const distance = Math.sqrt(distanceSquared);

				if (distance < 0.1) continue;

				// Calculate force
				const forceMagnitude = G * (bodyA.mass * bodyB.mass) / distanceSquared;

				// Calculate acceleration for both bodies
				const forceDirection = direction.normalize();
				const forceVector = forceDirection.multiplyScalar(forceMagnitude);

				// Apply accelerations (F = ma, so a = F/m)
				const accelerationA = new Vector3()
					.copy(forceVector)
					.multiplyScalar(1 / bodyA.mass);

				const accelerationB = new Vector3()
					.copy(forceVector)
					.multiplyScalar(-1 / bodyB.mass);

				bodyA.acceleration.add(accelerationA);
				bodyB.acceleration.add(accelerationB);
			}
		}
	}

	private updatePositionsAndVelocities(): void {
		const {dt} = SIMULATION_CONFIG;

		this.bodies.forEach(body => {
			// Update velocity using current acceleration
			const deltaV = new Vector3()
				.copy(body.acceleration)
				.multiplyScalar(dt);
			body.velocity.add(deltaV);

			// Update position using current velocity
			const deltaP = new Vector3()
				.copy(body.velocity)
				.multiplyScalar(dt);
			body.position.add(deltaP);
		});
	}
}