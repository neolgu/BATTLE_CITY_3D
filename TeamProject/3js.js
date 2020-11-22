import * as THREE from './three/build/three.module.js';
import { FBXLoader } from '/three/examples/jsm/loaders/FBXLoader.js'

export class GrapicManager {
    constructor(canvasId) {
        const id = '#' + canvasId;
        const canvas = document.querySelector(id);
        this.renderer = new THREE.WebGLRenderer({ canvas });

        this.flag = false;
        this.modelList = {};
    }

    init() {
        const fov = 50;
        const aspect = 1;  // the canvas default
        const near = 0.1;
        const far = 2000;

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0,100,-33);
        this.camera.rotation.y = Math.PI;
        this.camera.rotation.x = 10 * Math.PI / 180.0;
        // this.camera.lookAt(0,0,0);


        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x50bcdf );

        { // light
            const light = new THREE.DirectionalLight(0xffffff, 1);
            light.position.set(0, 100, 0);
            this.scene.add(light);
            // light.castShadow = true;
            // light.shadow.mapSize.widht = 700;
            // light.shadow.mapSize.height = 700;
        }

        {
            const groundGeometry = new THREE.PlaneBufferGeometry(105, 105);
            const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 });
            const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
            groundMesh.rotation.x = Math.PI * -.5;
            groundMesh.receiveShadow = true;

            this.scene.add(groundMesh);
        }

        this.fbxLoader = new FBXLoader();


        // {
        //     fbxLoader.load('./model/tank.fbx', (root) => {
        //         console.log("add");
        //         this.scene.add(root);
        //         root.scale.set(0.08, 0.08, 0.08);

        //         // root.add(this.camera)
        //     });

        //     var temp;
        //     fbxLoader.load('./model/Mario Brick.fbx', (root) => {
        //         this.scene.add(root);
        //         temp = root;
        //         root.scale.set(0.09, 0.09, 0.09);
        //         root.position.x = 5;

        //     });
        //     fbxLoader.load('./model/Mario Brick.fbx', (root) => {
        //         this.scene.add(root);
        //         root.scale.set(0.09, 0.09, 0.09);
        //         root.position.x = 15;
        //         root.position.z -= 0;
        //     });
        //     fbxLoader.load('./model/Mario Brick.fbx', (root) => {
        //         this.scene.add(root);
        //         root.scale.set(0.09, 0.09, 0.09);
        //         root.position.x += 25;
        //         root.position.z -= 0;
        //     });
        //     fbxLoader.load('./model/Mario Brick.fbx', (root) => {
        //         this.scene.add(root);
        //         root.scale.set(0.09, 0.09, 0.09);
        //         root.position.x += 35;
        //         root.position.z -= 0;
        //     });
        //     fbxLoader.load('./model/Mario Brick.fbx', (root) => {
        //         this.scene.add(root);
        //         root.scale.set(0.09, 0.09, 0.09);
        //         root.position.x += 45;
        //         root.position.z -= 0;
        //     });
        // }
    }

    dataBind(objlist) {
        this.data = objlist;
        this.setStage();
    }

    setStage() {
        this.fbxLoader.load('./model/tank.fbx', (root) => {
            this.scene.add(root);
            root.scale.set(0.08, 0.08, 0.08);

            this.modelList.player = root;
            root.add(this.camera);

            const boxWidth = 100;
            const boxHeight = 100;
            const boxDepth = 100;
            const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
          
            const material = new THREE.MeshBasicMaterial({color: 0x44aa88});  // greenish blue
          
            const cube = new THREE.Mesh(geometry, material);
            cube.position.z = -50;
            // root.add(cube)
        });
    }

    update() {
        if (this.modelList.player != undefined) {
            this.modelList.player.position.x = this.data.player.x_pos * 50;
            this.modelList.player.position.z = -this.data.player.y_pos * 50;
            this.modelList.player.rotation.y = this.data.player.theta * Math.PI / 180.0 + (Math.PI / 2.0);
        }
    }

    execuse() {
        console.log("render start");
        this.flag = true;
        this.render();
    }

    stop() {
        this.flag = false;
    }

    render() {
        this.update();
        this.renderer.render(this.scene, this.camera);
        if (this.flag) {
            requestAnimationFrame(this.render.bind(this));
        }
    }
}