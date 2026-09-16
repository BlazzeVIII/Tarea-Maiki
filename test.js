

//  aqui lo probe con  node test.js

const assert = require("assert");
const { calcularResultado } = require("./server");

//mismo ejemplo del PDF (Jugador1: 10, 5, 25 -> 16)
const resultado1 = calcularResultado(10, 5, 25);
assert.strictEqual(resultado1, 16, `Jugador1 debería dar 16, dio ${resultado1}`);
console.log("Test Jugador1 OK ->", resultado1);

//jugador3 del ejemplo del PDF: 15, 3, 30 -> 18.9
const resultado2 = calcularResultado(15, 3, 30);
assert.strictEqual(resultado2, 18.9, `Jugador3 debería dar 18.9, dio ${resultado2}`);
console.log("Test Jugador3 OK ->", resultado2);

//jugador4 del ejemplo del PDF: 12, 4, 18 -> 12.6
const resultado3 = calcularResultado(12, 4, 18);
assert.strictEqual(resultado3, 12.6, `Jugador4 debería dar 12.6, dio ${resultado3}`);
console.log("Test Jugador4 OK ->", resultado3);

console.log("\nTodos los tests pasaron correctamente");
