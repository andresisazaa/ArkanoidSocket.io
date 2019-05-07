const { io } = require('../server');
const { Usuarios } = require('../clases/usuarios');
const usuarios = new Usuarios();

class Ball {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
    }
}

var ball = new Ball(0, 0);
var score;
var lives;
var p1;
var p2;
var bricks;



io.on('connection', (client) => {

    //Desconexion
    client.on('disconnect', () => {
        // let usuarioBorrado = usuarios.borrarUsuarios(client.id);
        usuarios.borrarUsuarios(client.id);
    });


    //Ingresar a una sala
    client.on('ingresarSala', (usuario, callback) => {
        if (!usuario.nombre || usuario.data) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            });
        }
        client.join(usuario.sala);
        usuarios.agregarUsuario(client.id, usuario.nombre, usuario.sala, usuario.posX);
        // console.log(usuarios.getUsuariosPorSala(usuario.sala).length);
        callback(usuarios.getUsuariosPorSala(usuario.sala));
    });

    //Iniciar juego
    /*client.on('startGame', (data) => {
        let usuario = usuarios.getUsuario(client.id);
        gameState.ball = data.ball;
        gameState.player1 = data.player1;
        gameState.player2 = data.player2;
        gameState.score = data.score;
        gameState.lives = data.lives;
        gameState.bricks = data.bricks;
        if (usuarios.getUsuariosPorSala(usuario.sala).length === 2);
        {
            client.broadcast.to(usuario.sala).emit('startGameServer', gameState);
        }
    });*/

    //Actualizar datos
    client.on('update', (data) => {
        ball.posX = data.x;
        ball.posY = data.y;
        p1 = data.p1;
        p2 = data.p2;
        score = data.score;
        lives = data.lives;
        bricks = data.bricks;
    });


});

setInterval(update, 1000 / 30);

function update() {

    let data = {
        posX: ball.posX,
        posY: ball.posY,
        p1: p1,
        p2: p2,
        score: score,
        lives: lives,
        bricks: bricks
    };
    // console.log(p1, p2);
    io.sockets.emit('updateServer', data);
}
