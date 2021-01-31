import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { IUpdater } from "./update";

export class Controls implements IUpdater {
    blocker: HTMLElement;
    gui: HTMLElement;
    pointer_controls: PointerLockControls;

    move_forward: boolean = false;
    move_backward: boolean = false;
    move_left: boolean = false;
    move_right: boolean = false;
    
    move_speed: number = 3; // in meters per second

    last_updated: number;

    camera: THREE.Camera;

    constructor(camera: THREE.Camera, domElement: HTMLElement){
        this.camera = camera;

        this.blocker = document.getElementById("blocker");
        this.gui = document.getElementById("gameUI");
        this.pointer_controls = new PointerLockControls(this.camera, domElement);
        
        this.blocker.addEventListener("click", () => {
            this.pointer_controls.lock();
        });
        
        this.pointer_controls.addEventListener('lock', () => {
            this.blocker.style.display = "none";
            this.gui.style.display = "block";
        });

        this.pointer_controls.addEventListener("unlock", () => {
            this.blocker.style.display = "";
            this.gui.style.display = "none";
        });

        domElement.addEventListener("keyup", this.onKeyUpListener.bind(this));
        domElement.addEventListener("keydown", this.onKeyDownListener.bind(this));
    }

    onKeyDownListener(event: KeyboardEvent): void {
        switch(event.code){
            case "KeyW":
                this.move_forward = true;
                break;
            case "KeyA":
                this.move_left = true;
                break;
            case "KeyS":
                this.move_backward = true;
                break;
            case "KeyD":
                this.move_right = true;
                break;
        }
    }

    onKeyUpListener(event: KeyboardEvent): void {
        switch(event.code){
            case "KeyW":
                this.move_forward = false;
                break;
            case "KeyA":
                this.move_left = false;
                break;
            case "KeyS":
                this.move_backward = false;
                break;
            case "KeyD":
                this.move_right = false;
                break;
        }
    }

    update(now: number): void {
        // set the first time update
        if(this.last_updated == undefined){
            this.last_updated = now;
            return;
        }

        if(!this.pointer_controls.isLocked){
            return;
        }

        let delta = (now - this.last_updated) / 1000;
        this.last_updated = now;

        let direction = new THREE.Vector3();

        direction.z = Number(this.move_forward) - Number(this.move_backward);
        direction.x = Number(this.move_right) - Number(this.move_left);
        direction.normalize();

        this.pointer_controls.moveForward(direction.z * this.move_speed * delta);
        this.pointer_controls.moveRight(direction.x * this.move_speed * delta);
    }
}
