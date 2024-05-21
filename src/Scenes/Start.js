class Start extends Phaser.Scene {
    constructor(){
        super("gameStart");
        this.my = {sprite: {}, text: {}};
        
    }

    preload(){
        this.load.setPath("./assets/");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create(){
        let my = this.my;
        this.nextScene = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        const name = this.add.bitmapText(85, 180, "rocketSquare", "Elijah Hynson's", 20);
        const title = this.add.bitmapText(85, 200, "rocketSquare", "The Hoppening", 50);
        const objective = this.add.bitmapText(85, 300, "rocketSquare", "Find your house key and collect all the gems to win the game!", 15);
        const controls = this.add.bitmapText(85, 350, "rocketSquare", "Left arrow to move left", 15);
        const controls2 = this.add.bitmapText(85, 380, "rocketSquare", "Right arrow to move right", 15);
        const controls3 = this.add.bitmapText(85, 410, "rocketSquare", "Up arrow to jump", 15);
        const start = this.add.bitmapText(85, 450, "rocketSquare", "Press SPACE to begin your journey",25);
        name.setBlendMode(Phaser.BlendModes.ADD);
        title.setBlendMode(Phaser.BlendModes.ADD);
        objective.setBlendMode(Phaser.BlendModes.ADD);
        controls.setBlendMode(Phaser.BlendModes.ADD);
        controls2.setBlendMode(Phaser.BlendModes.ADD);
        controls3.setBlendMode(Phaser.BlendModes.ADD);
        start.setBlendMode(Phaser.BlendModes.ADD);

        document.getElementById('description').innerHTML = '<h2>The Hoppening</h2>'
    }

    update(){

        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("loadScene");
        }
    
    }
    
}