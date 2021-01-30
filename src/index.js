import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import junk_pipe from "./assets/junk-pipe.glb";

document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({antialias: true});

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    console.log({"junk_pipe": junk_pipe});

    const loader = new GLTFLoader();

    function render(){
        // requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    loader.load(
        junk_pipe,
        gltf => {
            gltf.scene.traverse((child) => {
                console.log(child);
            });
            scene.add(gltf.scene);

            render();
        }
    );

    camera.position.z = 5;
    camera.position.x = 1;
    camera.position.y = 2;

});