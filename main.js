"use strict";

const mysql = require("mysql");
const config = require("./config");
const DAOUsers = require("./DAOUsers");
const DAOTasks = require("./DAOTasks");

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});

let daoUser = new DAOUsers(pool);
let daoTask = new DAOTasks(pool);

// Definición de las funciones callback
function cb_isUserCorrect(err, result) {
    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("Usuario y contraseña correctos");
    } else {
        console.log("Usuario y/o contraseña incorrectos");
    }
}

function cb_getUserImage(err, result) {
    if (err) {
        console.log(err.message);
    } else if (result) {
        console.log("La imagen del usuario es = " + result);
    } else {
        console.log("No existe el usuario");
    }
}

function cb_getAllTasks(err, tareas) {
    if (err) {
        console.log(err.message)
    } else {
        console.log(tareas);
    }
}

function cb_generica(err) {
    if (err) {
        console.log(err.message);
    } else {
        console.log("CORRECT");
    }
}
// Uso de los métodos de las clases DAOUsers y DAOTasks
/*
daoUser.isUserCorrect("dacuna@ucm.es", "hola", cb_isUserCorrect);
daoUser.isUserCorrect("zhong@ucm.es", "adios", cb_isUserCorrect);
daoUser.isUserCorrect("clara@ucm.es", "quetal", cb_isUserCorrect);

daoUser.getUserImageName("dacuna@ucm.es", cb_getUserImage);
daoUser.getUserImageName("zhong@ucm.es", cb_getUserImage);
daoUser.getUserImageName("clara@ucm.es", cb_getUserImage);
daoUser.getUserImageName("cl@ucm.es", cb_getUserImage);
*/
let task1 = {
    text: "Comprar huevos",
    done: false,
    tags: ["supermercado", "compra", "hogar", "alimentacion"]
};
let task2 = {
    text: "Limpiar",
    done: false,
    tags: ["hogar", "limpieza"]
};
/*
daoTask.insertTask("dacuna@ucm.es", task1, cb_generica);
/*
daoTask.insertTask("zhong@ucm.es", task2, cb_generica);
*/
/*
daoTask.getAllTasks("dacuna@ucm.es", cb_getAllTasks);
/*
daoTask.getAllTasks("zhong@ucm.es", cb_getAllTasks);
*/

daoTask.markTaskDone(4, cb_generica);

/*
daoTask.deleteCompleted("dacuna@ucm.es", cb_generica);
*/