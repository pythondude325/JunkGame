import * as THREE from "three";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import maze_url from "../assets/maze.glb";

export class Maze {
    scene: THREE.Scene;
    maze_data: GLTF;
    gltf_loader: (file_url: string) => GLTF;

    constructor(loader: (file_url: string) => GLTF, scene: THREE.Scene){
        this.scene = scene;
        this.gltf_loader = loader;
    }

    async load_data(){
        this.maze_data = await this.gltf_loader(maze_url);
    }

    generate_maze(){
        
    }

}