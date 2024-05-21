var gemCount,
    hud;


class Platformer extends Phaser.Scene {
    constructor() {
        super("platformerScene");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 10000;    // DRAG < ACCELERATION = icy slide
        this.physics.world.gravity.y = 1500;
        this.JUMP_VELOCITY = -600;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.totalGems = 0;
        this.hasKey = 0;
        this.playOnce = 0;
    }

    create() {
        gemCount = this.add.text(46, 20, '0', { fontSize: '24px', fill: '#fff' });


        // Create a new tilemap game object which uses 18x18 pixel tiles, and is
        // 45 tiles wide and 25 tiles tall.
        this.map = this.add.tilemap("platformer-level-1", 16, 16, 90, 60);

        // Add a tileset to the map
        // First parameter: name we gave the tileset in Tiled
        // Second parameter: key for the tilesheet (from this.load.image in Load.js)
        this.tileset = this.map.addTilesetImage("1d-platformer-packed", "tilemap_tiles");

        // Create a layer
        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);

        // Make it collidable
        this.groundLayer.setCollisionByProperty({
            collides: true
        });

        // TODO: Add createFromObjects here
        // Find coins in the "Objects" layer in Phaser
        // Look for them by finding objects with the name "coin"
        // Assign the coin texture from the tilemap_sheet sprite sheet
        // Phaser docs:
        // https://newdocs.phaser.io/docs/3.80.0/focus/Phaser.Tilemaps.Tilemap-createFromObjects

        this.gems = this.map.createFromObjects("Objects", {
            name: "gem",
            key: "tilemap_sheet",
            frame: 102
        });

        this.key = this.map.createFromObjects("Objects", {
            name: "key",
            key: "tilemap_sheet",
            frame: 96
        });

        this.pit = this.map.createFromObjects("Objects", {
            name: "deathbox",
            key: "tilemap_sheet",
            frame: 0
        });

        this.exitdoor = this.map.createFromObjects("Objects", {
            name: "exitdoor",
            key: "tilemap_sheet",
            frame: 56
        });

        // TODO: Add turn into Arcade Physics here
        // Since createFromObjects returns an array of regular Sprites, we need to convert 
        // them into Arcade Physics sprites (STATIC_BODY, so they don't move) 
        this.physics.world.enable(this.gems, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.key, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.pit, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.exitdoor, Phaser.Physics.Arcade.STATIC_BODY);

        // Create a Phaser group out of the array this.coins
        // This will be used for collision detection below.
        this.gemGroup = this.add.group(this.gems);
        this.keyGroup = this.add.group(this.key);
        this.deathGroup = this.add.group(this.pit);
        this.doorGroup = this.add.group(this.exitdoor);

        // set up player avatar
        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);

        // TODO: Add coin collision handler
        // Handle collision detection with coins
        this.physics.add.overlap(my.sprite.player, this.gemGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.totalGems += 1
            this.sound.play("gemCollect", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
        });
        this.physics.add.overlap(my.sprite.player, this.keyGroup, (obj1, obj2) => {
            obj2.destroy(); // remove key on overlap
            this.sound.play("keyGrabbed", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            this.hasKey += 1;
        });

        this.physics.add.overlap(my.sprite.player, this.deathGroup, (obj1, obj2) => {
            this.sound.play("playerLand", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
            this.scene.start("youDied");
        });

        this.physics.add.overlap(my.sprite.player, this.doorGroup, (obj1, obj2) => {
            if(this.hasKey == 1 && this.totalGems == 31){
                this.scene.start("gameEnd");
                this.sound.play("victoryMusic", {
                    volume: 1   // Can adjust volume using this, goes from 0 to 1
                });
            }
        });

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        //this.input.keyboard.on('keydown-D', () => {
            //this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            //this.physics.world.debugGraphic.clear()
        //}, this);

        // TODO: Add movement vfx here
        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['window_03.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.06},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 16,
            lifespan: 250,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.walking.stop();

        my.vfx.jumping = this.add.particles(0, 0, "kenny-particles", {
            frame: ['light_01.png', 'light_02.png', 'light_03.png'],
            // TODO: Try: add random: true
            scale: {start: 0.03, end: 0.3},
            // TODO: Try: maxAliveParticles: 8,
            maxAliveParticles: 1,
            lifespan: 850,
            // TODO: Try: gravityY: -400,
            alpha: {start: 1, end: 0.1}, 
        });

        my.vfx.jumping.stop();

        // TODO: add camera code here        
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);

        //my.text.life = this.add.bitmapText(640, 50, "rocketSquare", "Lives " + this.lives);

    }

    update() {

        if(this.totalGems == 31 && this.playOnce == 0){
            this.sound.play("allCollected", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            
            });
            this.playOnce += 1
        }
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();

            }
        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            // TODO: add particle following code here
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);

            // Only play smoke effect if touching the ground

            if (my.sprite.player.body.blocked.down) {

                my.vfx.walking.start();
            }
        } else {
            // Set acceleration to 0 and have DRAG take over
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            // TODO: have the vfx stop playing
            my.vfx.walking.stop();
        }

        // player jump
        // note that we need body.blocked rather than body.touching b/c the former applies to tilemap tiles and the latter to the "ground"
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jump", {
                volume: 1   // Can adjust volume using this, goes from 0 to 1
            });
        }

        
        if (my.sprite.player.body.blocked.down) {
            my.vfx.jumping.stop();
        } else if (!my.sprite.player.body.blocked.down && cursors.up.isDown) {
            
            my.vfx.jumping.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);

            my.vfx.jumping.setParticleSpeed(0, 0);

            my.vfx.jumping.start();
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }
}