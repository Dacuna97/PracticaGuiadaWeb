"use strict"
// app.js
const config = require("./config");
const DAOTasks = require("./DAOTasks");
const DAOUsers = require("./DAOUsers");
const path = require("path");
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const logger = require('morgan');
const session = require("express-session");
const mysqlSession = require("express-mysql-session");
const MySQLStore = mysqlSession(session);
const sessionStore = new MySQLStore(config.mysqlConfig);

const middlewareSession = session({
    saveUninitialized: false,
    secret: "cifrado_pibe",
    resave: false,
    store: sessionStore
});

// Crear un servidor Express.js
const app = express();

// Crear un pool de conexiones a la base de datos de MySQL
const pool = mysql.createPool(config.mysqlConfig);

// Crear una instancia de DAOTasks
const daoT = new DAOTasks(pool);
// Crear una instancia de DAOUsers
const daoU = new DAOUsers(pool);

//funciones
function createTask(text) {
    let words = text.split(/ +/);
    let sol = {
        text: "",
        tags: []
    };
    words.reduce((ac, n) => {
        if (/@\w+/.test(n)) {
            ac.tags.push(n.substring(1));
        } else {
            ac.text = ac.text + " " + n;
        }
        return ac;
    }, sol);
    console.log(sol);
    sol.text = sol.text.trim(); //para quitar el espacio que se nos queda al principio
    return sol;
}
//-------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public", "views"));

const ficherosEstaticos = path.join(__dirname, "public");

//use
app.use(logger('dev'));
app.use(express.static(ficherosEstaticos));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(middlewareSession);

function mi_middleware(request, response, next) {
    if (request.session.currentUser) {
        response.locals.userEmail = request.session.currentUser;
        next(); // Saltar al siguiente middleware
    } else {
        response.redirect("/login");
    }
}

app.get("/index", mi_middleware, function (request, response) {
    daoT.getAllTasks(request.session.currentUser, function (err, tareas) {
        if (err) {
            console.log(err.message)
        } else {
            console.log(tareas);
            response.render("index", {
                tasks: tareas
            });
        }
    });
});

app.post("/addTask",mi_middleware, function (request, response) {
    let task = createTask(request.body.new_task);
    task.done = 0;
    daoT.insertTask(request.session.currentUser, task, function (err) {
        if (err) {
            console.log(err.message);
        } else {
            response.redirect("/index");
        }
    });
});

app.get("/finish/:id", mi_middleware, function (request, response) {
    daoT.markTaskDone(request.params.id, function (err) {
        if (err) {
            console.log(err.message)
        } else {
            response.redirect("/index");
        }
    });
});

app.get("/deleteCompleted",mi_middleware, function (request, response) {
    daoT.deleteCompleted(request.session.currentUser, function (err) {
        if (err) {
            console.log(err.message)
        } else {
            response.redirect("/index");
        }
    });
});

app.get("/login", function (request, response) {
    /*response.render("login", {
        errorMsg : request.session.error
    });*/
    response.render("login", {
        errorMsg: null
    });
})
app.post("/login", function (request, response) {
    console.log("entro en post");
    let user_email = request.body.email;
    let user_password = request.body.password;
    daoU.isUserCorrect(user_email, user_password, function (err, existe) {
        if (!existe) {
            response.render("login", {
                errorMsg: "Direccion y/o contraseña no válidos"
            });
        } else {
            request.session.currentUser = user_email;
            response.redirect("/index");
        }
    });
});

app.get("/logout", function (request, response) {
    request.session.destroy();
    response.redirect("/login");
});

app.get("/imagenUsuario", mi_middleware, function(request, response){
    daoU.getUserImageName(request.session.currentUser, function(err, img){
        if(img === null){
            let pathImg = path.join(__dirname, "public", "img", "avatar.png");
            response.sendFile(pathImg);
        }
        else{
            let pathImg = path.join(__dirname, "public", "profile_imgs", img);
            response.sendFile(pathImg);
        }
    });
});
// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});