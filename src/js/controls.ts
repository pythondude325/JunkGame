import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";


export class Controls {
    blocker: HTMLElement;
    pointer_controls: PointerLockControls;

    camera: THREE.Camera;
    _position: THREE.Vector3;

    set position(value: THREE.Vector3){
        this._position = value;
        this.camera.position.copy(value);
    }

    get position(): THREE.Vector3 {
        return this._position;
    }

    constructor(camera: THREE.Camera){
        this.camera = camera;

        this.blocker = document.getElementById("blocker");
        this.pointer_controls = new PointerLockControls(this.camera, document.body);
        
        this.blocker.addEventListener("click", () => {
            this.pointer_controls.lock();
        });
        
        this.pointer_controls.addEventListener('lock', () => {
            this.blocker.style.display = "none";
        });

        this.pointer_controls.addEventListener("unlock", () => {
            this.blocker.style.display = "";
        });
    }
}
