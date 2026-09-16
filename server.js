

const express = require("express"); // el requires trae las librerías instaladas con npm install.
const cors = require("cors");
const mysql = require("mysql2/promise");

const app = express();
app.use(cors());  // El app use cors permite que la página HTML (que corre en el navegador) pueda hacerle peticiones al servidor 
app.use(express.json());
app.use(express.static("public")); // sirve para abrir mi pagina en el navegador y hacerle peticiones

// app useexpress.json le dice a express cuando llegue un post luego lee el cuerpo como JSON automáticamente

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "1234", 
  database: "futbol5",
};

let pool;
async function conectarBD() {
  pool = await mysql.createConnection(dbConfig);
  console.log("Conectado a la base de datos futbol5");
}


// Función que calcula la nota final de un entrenamiento
// Potencia de tiro = 20%, Velocidad = 30%, Pases = 50% por ciento y con esto encuentro resultado final
function calcularResultado(potencia, velocidad, pases) {
  const resultado = potencia * 0.2 + velocidad * 0.3 + pases * 0.5;
  return Math.round(resultado * 100) / 100; //tecnica para que el resultado no me de varios decimales, sino dos
}

// Con esto gurado un entrenamiento. Cuento con variables o valores que me llegan de la pagina  y se guarda en la base de datos.

app.post("/api/entrenamiento", async (req, res) => {
  try {
    const { jugador_id, numero_entrenamiento, potencia_tiro, velocidad, pases_efectivos } = req.body;

    // Validacion de datos
    // valida que no falte ningún dato 
    if (!jugador_id || !numero_entrenamiento || potencia_tiro == null || velocidad == null || pases_efectivos == null) {
      return res.status(400).json({ mensaje: "Faltan datos del entrenamiento." });
    }
    // pide que el numero sea 1 2 o 3, si es otro devuelve error
    if (![1, 2, 3].includes(Number(numero_entrenamiento))) {
      return res.status(400).json({ mensaje: "El numero_entrenamiento debe ser 1, 2 o 3." });
    }
    
    // se calcula el resultado gracias a la funcion (calcularResultado) con la formula que dio Maiki
    const resultado = calcularResultado(Number(potencia_tiro), Number(velocidad), Number(pases_efectivos));

    // Guardamos o actualizamos si ese jugador ya tenía ese entrenamiento registrado
    await pool.query(
      `INSERT INTO entrenamientos (jugador_id, numero_entrenamiento, potencia_tiro, velocidad, pases_efectivos, resultado)
       VALUES (?, ?, ?, ?, ?, ?)`
      [jugador_id, numero_entrenamiento, potencia_tiro, velocidad, pases_efectivos, resultado]
    );
    
    //esto es lo que la página recibe de vuelta
    res.json({
      mensaje: "Entrenamiento guardado correctamente.",
      resultado_calculado: resultado,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error guardando el entrenamiento.", error: error.message });
  }
});

//Obtener el equipo titular
// Solo devuelve el equipo si TODOS los jugadores ya tienen los 3 entrenamientos registrados. Si falta alguno avisa

app.get("/api/titulares", async (req, res) => {
  try {
    //cuantos jugadores hay en total
    const [jugadores] = await pool.query("SELECT id, nombre FROM jugadores");
    const totalJugadores = jugadores.length;

    //cuantos entrenamientos tiene cada jugador
    const [conteo] = await pool.query(
      `SELECT jugador_id, COUNT(*) AS cantidad
       FROM entrenamientos
       GROUP BY jugador_id`
    );

    const jugadoresConTres = conteo.filter((j) => j.cantidad === 3).length;

    if (jugadoresConTres < totalJugadores) {
      return res.json({ // jugador no tiene los 3 entrenamientos completos
        mensaje: "No hay suficiente información. Todavía faltan entrenamientos por registrar.",
      });
    }

    //si todos completaron los 3 entrenamiento caluclo el promedio de cada jugador
    const [promedios] = await pool.query(
      `SELECT j.id, j.nombre, AVG(e.resultado) AS promedio
       FROM jugadores j
       JOIN entrenamientos e ON e.jugador_id = j.id // JOIN es para unir las tablas jugadores y entrenamientos
       GROUP BY j.id, j.nombre
       ORDER BY promedio DESC // ordena de mayor a menor promedio
       LIMIT 5` // el limite son 5 porque solo 5 jugadores titulan
    );

    const titulares = promedios.map((j) => ({
      jugador: j.nombre,
      puntuacion: Math.round(j.promedio * 100) / 100,
    }));

    res.json({ equipo_titular: titulares });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error calculando el equipo titular.", error: error.message });
  }
});


// esto es apoyo visual para mi html para que muestre jugadores y entrenamientos que registre y la lista de entrenamientos que ya tiene cada uno

app.get("/api/jugadores", async (req, res) => {
  try {
    const [jugadores] = await pool.query("SELECT id, nombre FROM jugadores ORDER BY id");
    res.json(jugadores);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo jugadores.", error: error.message });
  }
});

// este es para lo de los entrenamientos de cada jugador
app.get("/api/estado", async (req, res) => {
  try {
    const [filas] = await pool.query(
      `SELECT j.id, j.nombre, COUNT(e.id) AS entrenamientos_registrados
       FROM jugadores j
       LEFT JOIN entrenamientos e ON e.jugador_id = j.id
       GROUP BY j.id, j.nombre
       ORDER BY j.id`
    );
    res.json(filas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo el estado.", error: error.message });
  }
});


// esto si lo busque para enlazar el servidor con la base de datos y poder probarlo en la pagina.

const PUERTO = 3000;
if (require.main === module) {
  conectarBD().then(() => {
    app.listen(PUERTO, () => {
      console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    });
  });
}

module.exports = { calcularResultado }; // se exporta para poder probarla en test.js
