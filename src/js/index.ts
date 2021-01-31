import "babel-polyfill";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import desk_glb from "../assets/desk.glb";
import { IUpdater } from "./update";
import { Controls } from "./controls";
import { Maze } from "./maze";
import { GameState } from "./state";

class GameRender implements IUpdater {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    canvas: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;

    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.HemisphereLight;

    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xaaeeff);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.position.x = 1;
        this.camera.position.y = 1.6;

        this.canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.canvas
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", () => {
            let height = window.innerHeight;
            let width = window.innerWidth;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        });

        this.ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 5);
        // this.directionalLight.position.z = 0.2;
        // this.directionalLight.position.x = 0.2;
        this.scene.add(this.directionalLight);
    }

    update(timestamp: number): void {
        this.renderer.render(this.scene, this.camera);
    }
}


class Game {
    renderer: GameRender;
    gltf_loader: GLTFLoader;
    blocker: HTMLElement;

    controls: Controls;

    game_state: GameState;

    constructor() {
        this.renderer = new GameRender();
        this.gltf_loader = new GLTFLoader();
        this.controls = new Controls(this.renderer.camera, document.body);
        this.game_state = new GameState(this.load_gltf.bind(this), this.renderer.scene);
    }

    render_loop(timestamp: number): void {
        window.requestAnimationFrame(this.render_loop.bind(this));

        this.controls.update(timestamp);
        this.renderer.update(timestamp);
    }

    async load_gltf(file_url: string): Promise<GLTF> {
        return new Promise((res, rej) => this.gltf_loader.load(file_url, res, undefined, rej));
    }

    async load_data(): Promise<void> {
        const data = await this.load_gltf(desk_glb);
        this.renderer.scene.add(data.scene);

        await this.game_state.load_models();
        await this.game_state.spawn_junk(1000);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const game = new Game();
    await game.load_data();
    Object.assign(window, { game });
    window.requestAnimationFrame(game.render_loop.bind(game));
});