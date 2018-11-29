"use strict";

let listaTareas = [{
        text: "Preparar práctica AW",
        tags: ["AW", "practica"]
    },
    {
        text: "Mirar fechas congreso",
        done: true,
        tags: []
    },
    {
        text: "Ir al supermercado",
        tags: ["personal"]
    },
    {
        text: "Mudanza",
        done: false,
        tags: ["personal"]
    },
];

function getToDoTasks(tasks) {
    let sol1 = tasks.filter(n => n.done != true);
    let sol2 = sol1.map(n => n.text);
    return sol2;
}

console.log(getToDoTasks(listaTareas));


function findByTag(tasks, parameter) {
    let sol = tasks.filter(n =>
        n.tags.indexOf(parameter) != -1);
    return sol;
}
console.log(findByTag(listaTareas, "personal"));


function findByTags(tasks, parameters) {
    let sol = tasks.filter(n =>
        n.tags.some(m => parameters.indexOf(m) != -1));
    return sol;
}
console.log(findByTags(listaTareas, ["personal", "practica"]));


function countDone(tasks) {
    let sol = tasks.reduce((ac, n) => {
        if (n.done == true) {
            ac = ac + 1;
        }
        return ac;
    }, 0)
    return sol;
}
console.log(countDone(listaTareas));

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
    sol.text = sol.text.trim(); //para quitar el espacio que se nos queda al principio
    return sol;
}
console.log(createTask("Ir al medico @personal @salud"));
console.log(createTask("@AW            @practica Preparar práctica AW"));
console.log(createTask("Ir a @deporte entrenar"));