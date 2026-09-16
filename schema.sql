
-- Todo esto si fue con apoyo
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS futbol5;
USE futbol5;

-- Tabla de jugadores con equipo de 7 jugadores. Cada uno con id y nombre. El id se genera solo.
CREATE TABLE IF NOT EXISTS jugadores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

-- Tabla de entrenamientos
-- Cada jugador tiene máximo 3 entrenamientos.
CREATE TABLE IF NOT EXISTS entrenamientos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    jugador_id INT NOT NULL,
    numero_entrenamiento INT NOT NULL,       -- 1, 2 o 3
    potencia_tiro DECIMAL(5,2) NOT NULL,     -- Km/h
    velocidad DECIMAL(5,2) NOT NULL,         -- Km/h
    pases_efectivos INT NOT NULL,            -- cantidad de pases
    resultado DECIMAL(5,2) NOT NULL,         -- nota calculada (20% + 30% + 50%)
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

-- Un jugador no puede tener dos veces el mismo entrenamiento.
    UNIQUE KEY unico_entrenamiento (jugador_id, numero_entrenamiento),
    FOREIGN KEY (jugador_id) REFERENCES jugadores(id)
);

--Se ponen los 7 jugadores del equipo y así no hay que crearlos a mano
INSERT INTO jugadores (nombre) VALUES
    ('Jugador1'),
    ('Jugador2'),
    ('Jugador3'),
    ('Jugador4'),
    ('Jugador5'),
    ('Jugador6'),
    ('Jugador7');


