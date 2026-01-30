const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true); // BABYLON 3D engine

const BBL = {
    cameraSetup() {
        // Scroll support
        const camera = new BABYLON.ArcRotateCamera(
            "camera",
            Math.PI / 2,   // alpha
            Math.PI / 4,   // beta
            30,            // radius (target distance)
            BABYLON.Vector3.Zero(), // target
            this.scene
        );
        camera.wheelPrecision = 50; // Zoom -speed
        camera.attachControl(canvas, true);
    },
    createWoodBar(w = 8, h = 0.2, d = 0.3, x = 0, y = 0, z = 0) {
        const woodMaterial = new BABYLON.StandardMaterial("woodMat", this.scene);
        woodMaterial.diffuseColor = new BABYLON.Color3(1.22, 0.98, 0.61);
        const plank = BABYLON.MeshBuilder.CreateBox(
            "plank",
            {width: w, height: h, depth: d},
            this.scene
        );
        plank.position.x = x;
        plank.position.y = y;
        plank.position.z = z;
        plank.material = woodMaterial;
    },

    groundSetup() {
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 10, height: 8, depth: 0.1}, this.scene);
        const groundMaterial = new BABYLON.StandardMaterial("ground", this.scene);
        groundMaterial.diffuseColor = new BABYLON.Color3(0.84, 0.84, 0.84); // gray
        groundMaterial.backFaceCulling = false; // render in back side
        ground.material = groundMaterial;
    },
    initsScene() {
        this.scene = new BABYLON.Scene(engine);
        this.cameraSetup();
        this.lightSetup();
        this.groundSetup();
        this.woodBarInit();
        this.wallInit();

        return this.scene;
    },
    lightSetup() {
        // Creates a light, aiming 0,1,0 - to the sky
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;   // Dim the light a small amount - 0 to 1
    },

    scene: null,

    wallSetup() {
        const wall = BABYLON.MeshBuilder.CreateBox("shed", {
            width: 10,
            height: 8,
            depth: 6
        }, this.scene);
    },

    woodBarInit() {
        this.createWoodBar(10, 0.2, 0.3, 0, 0, -3.9); // ground w
        this.createWoodBar(10, 0.2, 0.3, 0, 0, 3.9);
        this.createWoodBar(0.3, 0.2, 8, 4.85, 0, 0); // ground h
        this.createWoodBar(0.3, 0.2, 8, -4.85, 0, 0);

        this.createWoodBar(0.3, 8, 0.3, 4.85, 4, -3.9); // back-left
        this.createWoodBar(0.3, 8, 0.3, -4.85, 4, -3.9); // back-right
        this.createWoodBar(0.2, 8, 0.3, -2.9, 4, -3.9);
        this.createWoodBar(0.2, 8, 0.3, -0.9, 4, -3.9);
        this.createWoodBar(0.2, 8, 0.3, 2.9, 4, -3.9);
        this.createWoodBar(0.2, 8, 0.3, 1, 4, -3.9);

        this.createWoodBar(0.3, 6, 0.3, 4.85, 3, 3.9); // front - left
        this.createWoodBar(0.3, 6, 0.3, -4.85, 3, 3.9); // front - right
        this.createWoodBar(0.2, 6, 0.3, -2.9, 3, 3.9);
        this.createWoodBar(0.2, 6, 0.3, -0.9, 3, 3.9);

        this.createWoodBar(0.3, 6, 0.2, 4.85, 3, 2); // side: left
        this.createWoodBar(0.3, 6, 0.2, 4.85, 3, 0);
        this.createWoodBar(0.3, 6, 0.2, 4.85, 3, -2);
        this.createWoodBar(0.3, 6, 0.2, -4.85, 3, 2); // side: right
        this.createWoodBar(0.3, 6, 0.2, -4.85, 3, 0);
        this.createWoodBar(0.3, 6, 0.2, -4.85, 3, -2);

        this.createWoodBar(10, 0.2, 0.3, 0, 6, -3.9); // floor 1: ground w
        this.createWoodBar(10, 0.2, 0.3, 0, 6, 3.9);
        this.createWoodBar(0.3, 0.2, 8, 4.85, 6, 0); // floor 1: ground h
        this.createWoodBar(0.3, 0.2, 8, -4.85, 6, 0);

        this.createWoodBar(10, 0.2, 0.3, 0, 8, -3.9); // floor 2
    },

    createWall(w, h, d, x = 0, y = 0, z = 0) {
        const wallMaterial = new BABYLON.StandardMaterial("wallMat", this.scene);
        wallMaterial.diffuseColor = new BABYLON.Color3(2.32, 2.3, 2.3);
        wallMaterial.backFaceCulling = false; // render in back side
        const wall = BABYLON.MeshBuilder.CreateBox("wall", {
            width: w,
            height: h,
            depth: d
        }, this.scene);
        wall.position.x = x;
        wall.position.y = y;
        wall.position.z = z;
        wall.material = wallMaterial;
    },

    createTriangleWall(a = 4, b = 3, x = 0, y = 0, z= 0, rotateY = null) {
        const positions = [
            0, 0, 0,   // (0,0)
            a, 0, 0,   // X
            0, b, 0    // Y
        ];

        // indices: create triangle
        const indices = [0, 1, 2];

        // custom mesh
        const customMesh = new BABYLON.Mesh("triangleWall", this.scene);
        const vertexData = new BABYLON.VertexData();
        vertexData.positions = positions;
        vertexData.indices = indices;

        // Light
        BABYLON.VertexData.ComputeNormals(positions, indices, vertexData.normals = []);
        vertexData.applyToMesh(customMesh);

        // Material
        const wallMaterial = new BABYLON.StandardMaterial("wallMat", this.scene);
        wallMaterial.diffuseColor = new BABYLON.Color3(2.32, 2.3, 2.3);
        wallMaterial.backFaceCulling = false;
        customMesh.material = wallMaterial;

        customMesh.position.x = x;
        customMesh.position.y = y;
        customMesh.position.z = z;

        // Rotate
        if (rotateY !== null) customMesh.rotation.y = rotateY;

        return customMesh;
    },

    creteCustomWall() {

    },



    wallInit() {
        this.createWall(10, 8.2, 0.02, 0, 4, -4.05); // back
        this.createWall(10, 6.2, 0.02, 0, 3, 4.05); // front
        this.createWall(0.02, 6.2, 8, -5, 3, 0); // left
        this.createWall(0.02, 6.2, 8, 5, 3, 0); // right

        this.createTriangleWall(8, 2.1, 5.05, 6.07, -4, (Math.PI / -2)); // left
        this.createTriangleWall(8, 2.1, -5.05, 6.07, -4, (Math.PI / -2)); // right

    },

}


const scene = BBL.initsScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
    scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
    engine.resize();
});

