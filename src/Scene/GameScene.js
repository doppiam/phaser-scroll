import Ship from "../Objects/Player";

var gameOver = false;

var sky;
var sky2;
var ship;
var shipVelocity = 600;

export default class GameScene extends Phaser.Scene {
    //=================================================================================================//
    constructor(test) {
      super({key:'GameScene'});
    }
    
    create() {
        sky = this.add.sprite(0, 0, 'sky');
        sky.setOrigin(0,0);
        sky.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        sky2 = this.add.sprite(0, -this.sys.game.config.height, 'sky');
        sky2.setOrigin(0,0);
        sky2.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
        sky2.flipY = 180;
        
        // player
        ship = new Ship(this, this.sys.game.config.width / 2, this.sys.game.config.height - 250, 'ship');
        ship.setDisplaySize(64, 96);

        // cursors
        this.cursors = this.input.keyboard.createCursorKeys();
    }
    
    update() {
        scroll([sky, sky2], this.sys.game);

        
        if (this.cursors.left.isDown) {
            ship.setVelocityX(-shipVelocity);
            ship.angle = -10;
        } else {
            ship.setVelocityX(shipVelocity);
            ship.angle = 10;
        }
    }
    //=================================================================================================//
}

function scroll(items, game) {
    var top = 0;
    var bottom = game.config.height;
    var velocity = 10;

    items.forEach(item => { 
        if(item.y != bottom) {
            item.y += velocity;
        } else {
            item.y = -game.config.height + velocity;
        }
    });
}