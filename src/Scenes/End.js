class End extends Phaser.Scene {
    constructor(){
        super("gameEnd");
        this.my = {sprite: {}, text: {}};
    }
    preload(){
        this.load.setPath("./assets/");

        this.load.bitmapFont("rocketSquare", "KennyRocketSquare_0.png", "KennyRocketSquare.fnt");
    }

    create(){
        let my = this.my;
        this.nextScene = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        const gameover = this.add.bitmapText(85, 200, "rocketSquare", "You made it back home!", 50);
        const restart = this.add.bitmapText(85, 450, "rocketSquare", "Press SPACE to reminisce on your journey",25);
        gameover.setBlendMode(Phaser.BlendModes.ADD);
        restart.setBlendMode(Phaser.BlendModes.ADD);
        //score.setBlendMode(Phaser.BlendModes.ADD);
        
        document.getElementById('description').innerHTML = '<h2>The Hoppening</h2>'
    }

    update(){
       
        if (Phaser.Input.Keyboard.JustDown(this.nextScene)) {
            this.scene.start("loadScene");
        }
    
    }


}