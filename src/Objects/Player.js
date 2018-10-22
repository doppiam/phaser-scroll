export default class Monster extends Phaser.Physics.Arcade.Sprite  {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture);
        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.setCollideWorldBounds(true);
    }
}