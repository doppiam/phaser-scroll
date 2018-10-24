import config from "../config";
import Player from "../Objects/Player";
import Ghost from "../Objects/Ghost";

var gameOver = false;
var life = config.START_LIFE;

var sky;
var forest;
var forest2;
var forest3;
var forest4;
var player;
var ghosts;
var playerGhostOverlap;

export default class GameScene extends Phaser.Scene {
    //=================================================================================================//
    constructor(test) {
      super({key:'GameScene'});
    }
    
    create() {
        sky = this.add.sprite(0, 0, 'sky');
        sky.setOrigin(0,0);
        sky.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);

        forest = doubleBg(this, 'forest', 'forest1', 1);
        forest2 = doubleBg(this, 'forest2', 'forest2', 1);
        forest3 = doubleBg(this, 'forest3', 'forest3', 1);
        forest4 = doubleBg(this, 'forest4', 'forest4', 1);
        
        // player
        player = new Player(this, 250, this.sys.game.config.height / 2, 'crow');
        this.anims.create({
            key: 'move',
            frames: this.anims.generateFrameNumbers('crow', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });
        player.anims.play('move');
        
        // ghost
        this.anims.create({
            key: 'death',
            frames: this.anims.generateFrameNumbers('ghostDeath', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('ghost', { start: 0, end: 6 }),
            frameRate: 10,
            repeat: -1
        });

        ghosts = spawnGhosts(this, 3);
        // ghost2 = spawnGhosts(this, ghost2);
        // ghost3 = spawnGhosts(this, ghost3);

        
        // cursors
        // this.cursors = this.input.keyboard.createCursorKeys();
        this.pointer = this.input.activePointer;

        // collisions
        //this.physics.add.collider(player, ghost);
    }
    
    update() {
        scroll(forest, this.sys.game, config.scrollVelocity);
        scroll(forest2, this.sys.game, config.scrollVelocity2);
        scroll(forest3, this.sys.game, config.scrollVelocity3);
        scroll(forest4, this.sys.game, config.scrollVelocity4);

        moveGhosts(this, ghosts);
        checkGhost(this, ghosts);
        
        this.input.on('pointerdown', function(pointer){
            player.setVelocityY(-config.playerVelocity);
        });
        this.input.on('pointerup', function(pointer){
            player.setVelocityY(config.playerVelocity);
        });
    }
    //=================================================================================================//
}

function scroll(item, game, velocity) {
    var end = -game.config.width / 2;
    var start = game.config.width + game.config.width / 2;
    
    var items = item.getChildren();
    items.forEach(item => {
        if(item.x != end) {
            item.x -= velocity;
        } else {
            item.x = start - velocity;
        } 
    });
}

function doubleBg(scene, varName, bg, repeat) {
    varName = scene.physics.add.staticGroup({
        key: bg,
        repeat: repeat,
        setXY: { x: scene.sys.game.config.width / 2, y: scene.sys.game.config.height / 2, stepX: scene.sys.game.config.width },
        setScale: {
            x: 3.4,
            y: 3.4,
        },
    });
    return varName;
}

// spawn a ghosts
function spawnGhosts(scene, repeat) {

    ghosts = scene.physics.add.group({
            key: 'ghost',
            repeat: repeat,
            enable: true,
            setCollideWorldBounds: false,
            setVelocityX: -config.ghostVelocity,
            setXY: {
                x: scene.sys.game.config.width,
                y: scene.sys.game.config.height,
                stepX: -Math.floor((Math.random() * 200) + 80),
                stepY: -Math.floor((Math.random() * 200) + 80),
            }
        }
    );

    ghosts.children.iterate(function (child) {
        child.anims.play('idle');
        scene.physics.add.overlap(player, child, hitGhost, false, scene);
    });

    // playerGhostOverlap = scene.physics.add.overlap(player, ghosts, hitGhost, null, scene);

    return ghosts;
}

// move ghosts, when exit from the screen reset position
function moveGhosts(scene, ghostNames) {
    var end = -100;
    var start = scene.sys.game.config.width + Math.floor((Math.random() * 250) + 10);

    ghostNames.children.iterate(function (child) {
        if(child.x >= end) {
            child.setVelocityX(-config.ghostVelocity + Phaser.Math.FloatBetween(0.1, 0.3));
        } else {
            child.x = start;
        }
    });

    // ghostNames.forEach(ghost => {
    //     if(ghost.x >= end) {
    //         ghost.setVelocityX(-config.ghostVelocity);
    //     } else {
    //         ghost.x = start;
    //     }
    // });
}

function checkGhost(scene, ghostNames) {
}

function hitGhost(player, singleGhost) {
    player.setTint(0xff0000);
    singleGhost.anims.play('death');
    singleGhost.on('animationcomplete', function(currentAnim, currentFrame){
        if (currentAnim.key == 'death' && currentFrame.index == 6) {
            singleGhost.disableBody(true, true);
            player.clearTint();
        }
    });
    
    life -= 1;

    if (ghosts.countActive() <= 2) {
        ghosts.killAndHide();
        ghosts = spawnGhosts(this, 3);
    }
}