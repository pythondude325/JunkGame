import * as THREE from "three";
import junk_data_json from "../assets/junk_data.json";
import junk_models from "../assets/junk.glb";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";

interface JunkData {
    junk_data: {model_name: string, name: string, desc: string}[];
}

const junk_data: JunkData = junk_data_json;

export class JunkItem {
    name: string;
    object: THREE.Object3D;

    constructor(name: string, junk_models: Record<string, THREE.Object3D>){
        this.name = name;
        this.object = junk_models[name].clone(true);
        this.object.position.y = 0;
        this.object.position.z = Math.random() * 48 - 24;
        this.object.position.x = Math.random() * 48 + 1;
        this.object.rotateY(Math.random() * Math.PI * 2);
    }
}

export class GameState {
    junk: JunkItem[];

    junk_objects: Record<string, THREE.Object3D>;
    gltf_loader: (file_url: string) => Promise<GLTF>;
    scene: THREE.Scene;
    
    constructor(gltf_loader: (file_url: string) => Promise<GLTF>, scene: THREE.Scene){
        this.junk = [];
        this.junk_objects = {};
        this.gltf_loader = gltf_loader;
        this.scene = scene;
    }

    async load_models(){
        const junk_model_gtlf = await this.gltf_loader(junk_models);
        for(var junk_object of junk_model_gtlf.scene.children){
            console.log(junk_object.name);
            this.junk_objects[junk_object.name] = junk_object;
        }
    }

    async spawn_junk(amount: number){
        for(let i = 0; i < amount; i++){
            const choice = Math.floor(Math.random() * junk_data.junk_data.length);
            const junk_name = junk_data.junk_data[choice].model_name;

            const my_junk_item = new JunkItem(junk_name, this.junk_objects);
            this.junk.push(my_junk_item);
            this.scene.add(my_junk_item.object);
        }
    }

}