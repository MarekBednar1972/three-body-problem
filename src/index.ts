import * as THREE from 'three';
import {PhysicsEngine} from './physics';
import {Renderer} from './renderer';
import {Body, VisualBody} from './types';
import {INITIAL_BODIES} from './config';

function initializeBodies(): VisualBody[] {
	return INITIAL_BODIES.map(bodyData => {
		const physical: Body = {
			mass: bodyData.mass,
			position: bodyData.position.clone(),
			velocity: bodyData.velocity.clone(),
			acceleration: new THREE.Vector3(0, 0, 0)
		};

		const geometry = new THREE.SphereGeometry(Math.pow(bodyData.mass / 1000, 1 / 3), 32, 32);
		const material = new THREE.MeshPhongMaterial({color: bodyData.color});
		const mesh = new THREE.Mesh(geometry, material);

		const trajectoryGeometry = new THREE.BufferGeometry();
		const trajectoryMaterial = new THREE.LineBasicMaterial({
			color: bodyData.color,
			opacity: 0.5,
			transparent: true
		});
		const trajectoryLine = new THREE.Line(trajectoryGeometry, trajectoryMaterial);

		return {
			physical,
			mesh,
			trajectory: {
				line: trajectoryLine,
				positions: []
			}
		};
	});
}

function main() {
	const container = document.getElementById('simulation');
	if (!container) throw new Error('Simulation container not found');

	const bodies = initializeBodies();
	const physicsEngine = new PhysicsEngine(bodies.map(b => b.physical));
	const renderer = new Renderer(container);

	bodies.forEach(body => renderer.addBody(body));

	window.addEventListener('resize', () => {
		renderer.handleResize(container.clientWidth, container.clientHeight);
	});

	function animate() {
		requestAnimationFrame(animate);
		physicsEngine.update();
		renderer.render();
	}

	animate();
}

main();