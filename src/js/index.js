import "babel-polyfill";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import junk_pipe from "../assets/junk-pipe.glb";

document.addEventListener("DOMContentLoaded", async () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaeeff);

    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.x = 1;
    camera.position.y = 2;

    const renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( ambientLight );

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.z = 0.2;
    directionalLight.position.x = 0.2;
    scene.add( directionalLight );

    const loader = new GLTFLoader();

    function render(){
        // requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    async function load_gltf(file_url){
        return new Promise((res, rej) => loader.load(file_url, res, undefined, rej));
    }

    const junk_pipe_data = await load_gltf(junk_pipe);
    const object_models = {};
    for(var child of junk_pipe_data.scene.children){
        object_models[child.name] = child;
        scene.add(child);
    }

    render();

});