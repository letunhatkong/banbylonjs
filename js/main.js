const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true); // BABYLON 3D engine

const BBL = {
    scene: null,
    initsScene() {
        this.scene = new BABYLON.Scene(engine);
        this.cameraSetup();
        this.lightSetup();
        this.groundSetup();
        this.wallSetup();
        return this.scene;
    },

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
        camera.wheelPrecision = 20; // Zoom -speed
        camera.attachControl(canvas, true);   // This attaches the camera to the canvas
    },
    lightSetup() {
        // Creates a light, aiming 0,1,0 - to the sky
        const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), this.scene);
        light.intensity = 0.7;   // Dim the light a small amount - 0 to 1
    },
    groundSetup() {
        // Built-in 'ground' shape.
        const ground = BABYLON.MeshBuilder.CreateGround("ground", {width: 12, height: 6}, this.scene);
    },
    buildShape() {
        // Built-in 'sphere' shape.
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 4, segments: 4}, this.scene);
        sphere.position.y = 1;   // Move the sphere upward 1/2 its height
    },
    wallSetup() {
        const wall1 = BABYLON.MeshBuilder.CreateBox("wall1", {width:12, height:6, depth:0.1}, this.scene);
        wall1.position.z = -2;
        const wall2 = wall1.clone("wall2");
        wall2.position.z = 2;
        const wall3 = BABYLON.MeshBuilder.CreateBox("wall3", {width:0.1, height:2, depth:4}, this.scene);
        wall3.position.x = -2;
        const wall4 = wall3.clone("wall4");
        wall4.position.x = 2;
    }

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

