class Usuarios {

    constructor() {
        this.usuarios = [];
    }

    agregarUsuario(id, nombre, sala, posX) {
        let usuario = {
            id: id,
            nombre: nombre,
            sala: sala,
            posX: posX
        };
        this.usuarios.push(usuario);
        return this.usuarios;
    }

    getUsuario(id) {
        let usuario = this.usuarios.filter(usuario => usuario.id === id)[0];
        return usuario;
    }

    getUsuarios() {
        return this.usuarios;
    }

    getUsuariosPorSala(sala) {
        let usuariosEnSala = this.usuarios.filter(usuario => usuario.sala === sala);
        return usuariosEnSala;
    }

    borrarUsuarios(id) {
        let usuarioBorrado = this.getUsuario(id);
        this.usuarios = this.usuarios.filter(usuario => usuario.id != id);
        return usuarioBorrado;
    }
}

module.exports = {
    Usuarios
}