import * as THREE from 'three';
import {VisualBody} from './types';
import {SIMULATION_CONFIG} from './config';

export class Renderer {
	private scene: THREE.Scene;
	private camera: THREE.PerspectiveCamera;
	private renderer: THREE.WebGLRenderer;
	private bodies: VisualBody[];

	constructor(container: HTMLElement) {
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
		this.renderer = new THREE.WebGLRenderer({antialias: true});
		this.bodies = [];

		this.setupScene(container);
	}

	private setupScene(container: HTMLElement): void {
		this.renderer.setSize(container.clientWidth, container.clientHeight);
		this.renderer.setClearColor(0x000000);
		container.appendChild(this.renderer.domElement);

		this.camera.position.set(0, 20, 40);
		this.camera.lookAt(0, 0, 0);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		const pointLight = new THREE.PointLight(0xffffff, 1);
		pointLight.position.set(10, 10, 10);

		this.scene.add(ambientLight);
		this.scene.add(pointLight);
	}

	addBody(body: VisualBody): void {
		this.bodies.push(body);
		this.scene.add(body.mesh);
		this.scene.add(body.trajectory.line);
	}

	updateTrajectories(): void {
		this.bodies.forEach(body => {
			body.trajectory.positions.push(body.physical.position.clone());
			if (body.trajectory.positions.length > SIMULATION_CONFIG.maxTrajectoryPoints) {
				body.trajectory.positions.shift();
			}

			const positions = new Float32Array(body.trajectory.positions.length * 3);
			body.trajectory.positions.forEach((pos, i) => {
				positions[i * 3] = pos.x;
				positions[i * 3 + 1] = pos.y;
				positions[i * 3 + 2] = pos.z;
			});

			body.trajectory.line.geometry.setAttribute(
				'position',
				new THREE.BufferAttribute(positions, 3)
			);
		});
	}

	render(): void {
		this.bodies.forEach(body => {
			body.mesh.position.copy(body.physical.position);
		});
		this.updateTrajectories();
		this.renderer.render(this.scene, this.camera);
	}

	handleResize(width: number, height: number): void {
		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(width, height);
	}
}