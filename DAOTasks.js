"use strict"
const mysql = require("mysql");

class DAOTasks {
    constructor(_pool) {
        this.pool = _pool;
    }
    getAllTasks(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error(`Error al obtener la conexión: ${err.message}`));
            } else {
                const sql = "SELECT ID, TEXT, DONE, TAG FROM TASK LEFT JOIN TAG ON USER=? AND ID=TASKID";
                connection.query(sql, [email], function (err, filas) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error en la consulta"));
                    } else {
                        let sol = [];
                        filas.forEach(element => {
                            let tareas = {
                                id: element.ID,
                                text: element.TEXT,
                                done: element.DONE,
                                tags: []
                            };
                            if (sol[tareas.id] == undefined) {
                                sol[tareas.id] = tareas;
                            }
                            if (element.TAG != null) {
                                sol[tareas.id].tags.push(element.TAG);
                            }
                        });
                        sol = sol.filter(element => element != undefined);
                        callback(null, sol);
                    }
                });
            }
        });
    }
    insertTask(email, task, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error(`Error al obtener la conexión: ${err.message}`));
            } else {
                const sql = "INSERT INTO TASK(user, text, done) VALUES(?,?,?)";
                connection.query(sql, [email, task.text, task.done], function (err, resultado) {
                    if (err) {
                        callback(new Error("Error en la consulta INSERT"));
                    } else {
                        if (task.tags.length > 0) {
                            let sql = insertMany("TAG", ["taskId", "tag"], task.tags.length);
                            let data = arrayConstruction(resultado.insertId, task.tags);
                            connection.query(sql, data, function (err, resultado) {
                                connection.release();
                                if (err) {
                                    callback(new Error("Error en la consulta insert tag"));
                                } else {
                                    callback(null);
                                }
                            });
                        }
                        else{
                            callback(null);
                        }
                    }
                });
            }
        });
    }
    markTaskDone(idTask, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error(`Error al obtener la conexión: ${err.message}`));
            } else {
                const sql = "UPDATE TASK SET DONE = 1 WHERE ID = ?";
                connection.query(sql, [idTask], function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error en la consulta"));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }
    deleteCompleted(email, callback) {
        this.pool.getConnection(function (err, connection) {
            if (err) {
                callback(new Error(`Error al obtener la conexión: ${err.message}`));
            } else {
                const sql = "DELETE FROM TASK WHERE USER = ? AND DONE = 1";
                connection.query(sql, [email], function (err, resultado) {
                    connection.release();
                    if (err) {
                        callback(new Error("Error en la consulta"));
                    } else {
                        callback(null);
                    }
                });
            }
        });
    }

}

function insertMany(tableName, attributes, length) {
    let delimiter = ',';
    let sql = "INSERT INTO " + tableName + " (" + attributes.join(delimiter) + ") VALUES ";
    let questionmarks = new Array(attributes.length).fill("?");
    let array_questionmarks = new Array(length).fill("(" + questionmarks.join(delimiter) + ")");
    sql = sql + array_questionmarks.join(delimiter);
    return sql;
}

function arrayConstruction(id, array) {
    let sol = [];
    array.forEach(element => {
        sol.push(id);
        sol.push(element);
    });
    return sol;
}
module.exports = DAOTasks;