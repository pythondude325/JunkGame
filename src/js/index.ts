import "babel-polyfill";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import junk_pipe from "../assets/junk-pipe.glb";

class GameRender {
    scene: THREE.Scene;
    camera: THREE.Camera;
    canvas: HTMLCanvasElement;
    renderer: THREE.WebGLRenderer;
    
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;

    constructor(){
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xaaeeff);

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;
        this.camera.position.x = 1;
        this.camera.position.y = 2;

        this.canvas = <HTMLCanvasElement> document.getElementById("renderCanvas");

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: this.canvas
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.ambientLight = new THREE.AmbientLight(0x404040);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        this.directionalLight.position.z = 0.2;
        this.directionalLight.position.x = 0.2;
        this.scene.add(this.directionalLight);
    }

    render(){
        this.renderer.render(this.scene, this.camera);
    }

}


class Game {
    renderer: GameRender;
    gltf_loader: GLTFLoader;

    object_models: Record<string, THREE.Object3D>;

    constructor(){
        this.renderer = new GameRender();
        this.gltf_loader = new GLTFLoader();
    }

    render(): void {
        this.renderer.render();
    }

    async load_gltf(file_url: string): Promise<GLTF> {
        return new Promise((res, rej) => this.gltf_loader.load(file_url, res, undefined, rej));
    }

    async load_data(): Promise<void> {
        const junk_data = await this.load_gltf(junk_pipe);
        this.object_models = {};
        for(var child of junk_data.scene.children){
            this.object_models[child.name] = child;
            this.renderer.scene.add(child);
        }
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const game = new Game();
    await game.load_data();
    game.render();
});