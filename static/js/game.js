
console.log("Foo");
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: loadImages,
        create: create,
        update: update
    }
};


const game = new Phaser.Game(config);
var player;
var platforms;
var cursors;
var fireball;
var dead = false;
var gameWon = false;
var health;
//  Input Events


function loadImages() {
    this.load.image('rock', 'assets/rock.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.spritesheet('goomba', 'assets/goomba.png', { frameWidth: 100, frameHeight: 100 });
    this.load.spritesheet('fire', 'assets/fire.png', { frameWidth: 100, frameHeight: 100 });

    console.log("Bar");

}

function setupAnimations(that, actionName, startFrame, endFrame) {
    that.anims.create({
        key: actionName,
        frames: that.anims.generateFrameNumbers('goomba', { start: startFrame, end: endFrame }),
        frameRate: 10,
        repeat: -1
    });
}

function setupFireballs(that) {

    that.anims.create({
        key: 'burn',
        frames: that.anims.generateFrameNumbers('fire', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

}

function burnUp(that) {
    dead = true;
    health.setText("Health: Dead");

    that.add.text(100, 400, 'LOSER!  👺', { fontSize: '32px', fill: '#000' });

}

function addFireball(that) {
    const fireball1 = that.physics.add.sprite(Math.random()*1000, 0, 'fire');
    //const fireball1 = that.physics.add.sprite(300, 500, 'fire');

    //fireball1.setCollideWorldBounds(true);
    that.physics.add.collider(player, fireball1, ()=>{burnUp(that)});


    fireball1.anims.play('burn', true);
    player.setVelocityY(100);


    return fireball1;
    game
}

function create() {
    this.add.image(400, 300, 'rock');
    platforms = this.physics.add.staticGroup();
    platforms.create(370, 580, 'ground');
    player = this.physics.add.sprite(100, 500, 'goomba');
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, platforms);

    setupAnimations(this, 'left', 0, 1);
    setupAnimations(this, 'right', 2, 4);
    setupAnimations(this, 'turn', 1, 3);

    setupFireballs(this);
    fireball = addFireball(this);
    console.log(fireball);

    health = this.add.text(500, 50, 'Health: Alive', { fontSize: '32px', fill: '#000' });

    cursors = this.input.keyboard.createCursorKeys();

}

function update() {
    if (dead || gameWon) {
        return;
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-110);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(110);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

//    fireball.anims.play('burn');

    if (fireball.getBottomRight().y > 600) {
        fireball = addFireball(this);
    }

    if (player.getBottomRight().x > 750) {
        gameWon = true;
        this.add.text(100, 300, 'Goomba - You Da Winna Boi', { fontSize: '32px', fill: '#003433' });
    }

    //debugger;

}