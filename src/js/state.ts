import * as THREE from "three";
import junk_data_json from "../assets/junk_data.json";
import junk_models from "../assets/junk.glb";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { IUpdater } from "./update";
import { Vector2 } from "three";

interface JunkData {
    junk_data: {model_name: string, name: string, desc: string}[];
}

const junk_data: JunkData = junk_data_json;

export class JunkItem {
    name: string;
    uuid: string;
    object: THREE.Object3D;

    constructor(name: string, junk_models: Record<string, THREE.Object3D>){
        this.name = name;
        this.object = junk_models[name].clone(true);
        this.object.position.y = 0;
        this.object.position.z = Math.random() * 48 - 24;
        this.object.position.x = Math.random() * 48 + 1;
        this.object.rotateY(Math.random() * Math.PI * 2);

        this.object.userData["junk_object"] = true;

        this.uuid = this.object.uuid;
    }
}

const zero_vector = new Vector2();

export class GameState {
    junk: JunkItem[];

    inventory: [];

    junk_objects: Record<string, THREE.Object3D>;
    gltf_loader: (file_url: string) => Promise<GLTF>;
    scene: THREE.Scene;
    raycaster: THREE.Raycaster;
    camera: THREE.Camera;

    seen_object: THREE.Object3D | null = null;
    object_popup: HTMLElement;
    object_name_el: HTMLElement;
    object_desc_el: HTMLElement;
    
    constructor(gltf_loader: (file_url: string) => Promise<GLTF>, scene: THREE.Scene, camera: THREE.Camera){
        this.junk = [];
        this.junk_objects = {};
        this.gltf_loader = gltf_loader;
        this.scene = scene;
        this.raycaster = new THREE.Raycaster();
        this.camera = camera;

        this.object_popup = document.getElementById("objectpopup");
        this.object_popup.style.display = "none";
        this.object_name_el = document.getElementById("hoverobjname");
        this.object_desc_el = document.getElementById("hoverobjdesc");
    }

    async load_models(){
        const junk_model_gtlf = await this.gltf_loader(junk_models);
        for(var junk_object of junk_model_gtlf.scene.children){
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

    get_junk_object_array(): THREE.Object3D[] {
        return this.junk.map(junk_item => junk_item.object);
    }

    update(timestamp: number){
        const junk_objects = this.get_junk_object_array();
        // console.log(junk_objects);
        
        this.raycaster.setFromCamera(zero_vector, this.camera);
        
        let intersections = this.raycaster.intersectObjects(junk_objects, true);
        if(intersections.length > 0 && intersections[0].distance <= 2.5){
            const intersection = intersections[0];

            let object = intersection.object;
            while(object.userData["junk_object"] != true){
                object = object.parent;
            }

            if(this.seen_object != object){
                this.seen_object = object;
                this.object_popup.style.display = "";

                console.log(object.name);

                const hovered_object_data = junk_data.junk_data.find(({model_name}) => model_name == object.name);
                this.object_name_el.innerText = hovered_object_data.name;
                this.object_desc_el.innerText = hovered_object_data.desc;
            }
        } else {
            if(this.seen_object != null){
                this.seen_object = null;
                this.object_popup.style.display = "none";
            }
        }
        console.log(this.seen_object);
    }
}