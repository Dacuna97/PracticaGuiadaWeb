"use strict"
const mysql = require("mysql");

class DAOUsers {
    constructor(_pool) {
        this.pool = _pool;
    }
    isUserCorrect(email, password, callback){
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error(`Error al obtener la conexión: ${err.message}`));
            } else {
                const sql = `SELECT Email, Password FROM USER WHERE EMAIL = ? AND PASSWORD = ?`;
                connection.query(sql, [email, password], function (err, filas) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error en la consulta"));
                    } else {
                        let existe = false;
                        if(filas && filas.length > 0){
                            existe = true;
                        }
                        callback(null, existe);
                    }
                });
            }
        });
    }
    getUserImageName(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error(`Error al obtener la conexión: ${err.message}`));
            } else {
                const sql = `SELECT IMG FROM USER WHERE EMAIL=?`;
                connection.query(sql, [email], function (err, filas) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error en la consulta"));
                    } else if (filas.length == 0){
                        callback(new Error("No se encontró al usuario " + email));
                    } else{
                        callback(null, filas[0].IMG);
                    }
                });
            }
        });
    }
}

module.exports = DAOUsers;