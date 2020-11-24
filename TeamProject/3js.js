import * as THREE from './three/build/three.module.js';
import { FBXLoader } from '/three/examples/jsm/loaders/FBXLoader.js'

export class GrapicManager {
    constructor(canvasId) {
        const id = '#' + canvasId;
        const canvas = document.querySelector(id);
        this.renderer = new THREE.WebGLRenderer({ canvas });
        this.renderer.shadowMap.enabled = true;

        this.flag = false;
        this.modelList = {};

        this.wallArray = [];
        this.enemyArray = [];
        this.enemyIdx = 0;
        this.bulletArray = [];
        this.loadedWallNum = 0;
        this.cc = null;
    }

    init() {
        const fov = 70;
        const aspect = 1;  // the canvas default
        const near = 0.1;
        const far = 2000;

        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 4, -6);
        this.camera.rotation.y = Math.PI / 180 * 180;
        this.camera.rotation.x = 10 * Math.PI / 180.0;
        // this.camera.lookAt(0,0,0);


        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x50bcdf);

        this.fbxLoader = new FBXLoader();
        this.textureLoader = new THREE.TextureLoader();

        { // light
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.PointLight(color, intensity);
            light.position.set(0, 150, 0);
            this.scene.add(light);

            light.castShadow = true;
            light.shadow.mapSize.width = 700;
            light.shadow.mapSize.height = 700;
        }

        {   //floor
            const floor_tex = this.textureLoader.load('./model/floor_texture.png');
            floor_tex.wrapS = THREE.RepeatWrapping;
            floor_tex.wrapT = THREE.RepeatWrapping;
            floor_tex.magFilter = THREE.NearestFilter;
            const repeats = 4;
            floor_tex.repeat.set(repeats, repeats);
            const groundGeometry = new THREE.PlaneBufferGeometry(105, 105);
            const groundMaterial = new THREE.MeshPhongMaterial({
                map: floor_tex,
                side: THREE.DoubleSide,
            });
            const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
            groundMesh.rotation.x = Math.PI * -.5;
            groundMesh.receiveShadow = true;
            this.scene.add(groundMesh);
        }

        {   //bullet load
            const sphereRadius = 1;
            const sphereWidthDivisions = 32;
            const sphereHeightDivisions = 16;
            this.sphereGeo = new THREE.SphereBufferGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions);
            this.sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' });
        }

        const skyloader = new THREE.CubeTextureLoader();
        const bgTexture = skyloader.load([
            './model/skybox_posx.png',
            './model/skybox_negx.png',
            './model/skybox_posy.png',
            './model/skybox_negy.png',
            './model/skybox_posz.png',
            './model/skybox_negz.png',
        ]);
        this.scene.background = bgTexture;
    }

    dataBind(objlist) {
        this.data = objlist;

        this.setStage();
    }

    setStage() {
        // PLAYER 생성
        this.fbxLoader.load('./model/LPTank.fbx', (root) => {
            root.scale.set(2.5, 2.5, 2.5);
            root.children[1].castShadow = true;
            this.modelList.player = root;
            this.scene.add(root);
            root.add(this.camera);
        });

        // WALL 생성
        for (var i = 0; i < this.data.wall_list.length; i++) {
            this.fbxLoader.load('./model/Mario Brick.fbx', (root) => {
                root.scale.set(0.09, 0.09, 0.09);
                root.children[0].castShadow = true;
                this.wallArray.push(root);
                if (this.loadedWallNum > 4)
                    this.scene.add(root);
                this.loadedWallNum++;
            });
        }

        // ENEMY 생성
        for (var i = 0; i < this.data.enemy_list.length; i++) {
            this.enemyArray.push(null);
            this.fbxLoader.load('./model/tank.fbx', (root) => {
                this.textureLoader.setCrossOrigin("anonymous");
                this.textureLoader.load("./model/tank_texture.jpg", function (texture) {
                    // mesh is a group contains multiple sub-objects. Traverse and apply texture to all.
                    root.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            // apply texture
                            child.material.map = texture
                            child.material.needsUpdate = true;
                        }
                    });
                });
                root.scale.set(0.08, 0.08, 0.08);

                root.children[0].castShadow = true;

                this.enemyArray[this.enemyIdx] = root;
                this.enemyIdx++;
                this.scene.add(root);
            });
        }

        // command center
        this.fbxLoader.load('./model/Question Mark Block.fbx', (root) => {
            root.scale.set(0.01, 0.01, 0.01);
            root.children[0].castShadow = true;
            console.log(root);
            this.cc = root;
            this.scene.add(root);
        });
    }

    update() {
        if (typeof this.update.wallInit == 'undefined')
            this.update.wallInit = 1;
        
        if (typeof this.update.ccInit == 'undefined')
            this.update.ccInit = 1;

        // wall first positioning
        if ((this.update.wallInit == 1) && (this.loadedWallNum == this.data.wall_list.length)) {
            this.update.wallInit = 0;
            for (var i = 0; i < this.data.wall_list.length; i++) {
                this.wallArray[i].position.x = this.data.wall_list[i].x_pos * 50;
                this.wallArray[i].position.z = -this.data.wall_list[i].y_pos * 50;
            }
        }
        // cc first positioning
        if ((this.update.ccInit == 1) && (this.cc != null)) {
            this.cc.position.x = this.data.commandCenter.x_pos * 50;
            this.cc.position.z = -this.data.commandCenter.y_pos * 50;
        }

        this.remove();
        this.add();

        // player move
        if (this.modelList.player != undefined) {
            this.modelList.player.position.x = this.data.player.x_pos * 50;
            this.modelList.player.position.z = -this.data.player.y_pos * 50;
            this.modelList.player.rotation.y = this.data.player.theta * Math.PI / 180.0 + (Math.PI / 2.0); //+ (Math.PI / 2.0)
            this.modelList.player.position.y = 0.8;
        }

        // enemy move
        for (var i = 0; i < this.enemyArray.length; i++) {
            if ((this.enemyArray[i] != null) && (this.data.enemy_list[i] != undefined)) {
                this.enemyArray[i].position.x = this.data.enemy_list[i].x_pos * 50;
                this.enemyArray[i].position.z = -this.data.enemy_list[i].y_pos * 50;
                this.enemyArray[i].rotation.y = this.data.enemy_list[i].theta * Math.PI / 180.0 + (Math.PI / 2.0); //+ (Math.PI / 2.0)
            }
        }

        //bullet move
        for (var i = 0; i < this.bulletArray.length; i++) {
            if (this.bulletArray[i] != null) {
                this.bulletArray[i].position.x = this.data.bullet_list[i].x_pos * 50;
                this.bulletArray[i].position.z = -this.data.bullet_list[i].y_pos * 50;
                this.bulletArray[i].position.y = 5;
            }
        }
    }

    remove() {
        //wall
        for (var i = 4; i < this.data.wall_list.length; i++) {
            if (this.data.wall_list[i] == null) {
                this.scene.remove(this.wallArray[i]);
                this.wallArray[i] = null;
            }
        }
        //enemy
        for (var i = 0; i < this.data.enemy_list.length; i++) {
            if (this.data.enemy_list[i] == null) {
                this.scene.remove(this.enemyArray[i]);
                this.enemyArray[i] = null;
            }
        }
        //bullet
        for (var i = 0; i < this.data.bullet_list.length; i++) {
            if (this.data.bullet_list[i] == null) {
                this.scene.remove(this.bulletArray[i]);
                this.bulletArray[i] = null;
            }
        }
    }

    add() {
        // enemy add
        if (this.data.enemy_list.length > this.enemyArray.length) {
            for (var i = this.enemyArray.length; i < this.data.enemy_list.length; i++) {
                this.fbxLoader.load('./model/tank.fbx', (root) => {
                    this.textureLoader.setCrossOrigin("anonymous");
                    this.textureLoader.load("./model/tank_texture.jpg", function (texture) {
                        // mesh is a group contains multiple sub-objects. Traverse and apply texture to all.
                        root.traverse(function (child) {
                            if (child instanceof THREE.Mesh) {

                                // apply texture
                                child.material.map = texture
                                child.material.needsUpdate = true;
                            }
                        });
                    });
                    root.scale.set(0.08, 0.08, 0.08);

                    root.children[0].castShadow = true;

                    this.enemyArray[this.enemyIdx] = root;
                    this.enemyIdx++;
                    this.scene.add(root);
                });
            }
        }

        //bullet add
        if (this.data.bullet_list.length > this.bulletArray.length) {
            for (var i = this.bulletArray.length; i < this.data.bullet_list.length; i++) {
                var mesh = new THREE.Mesh(this.sphereGeo, this.sphereMat);
                mesh.castShadow = true;
                this.bulletArray.push(mesh);
                this.scene.add(mesh);
            }
        }
    }

    removeObject(target) {
        if (target.tag == 3) {
            console.log(this.wallArray[target.idx]);
            this.scene.remove(this.wallArray[target.idx]);
            this.wallArray.splice(target.idx, 1);
        }
        else if (target.tag == 5) {
            this.bullet_list.splice(target.idx, 1);
        }
        else if (target.tag == 2) {
            this.enemy_list.splice(target.idx, 1);
        }
        else if (target.tag == 4) {

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