# Futbol 5 - Equipo Titular

Esta es mi tarea. La idea es que un equipo de futbol 5 registre los entrenamientos de la semana (son 3 por semana) y conesos datos el programa calcula quiénes son los 5 titulares para el partido.

Lo hice investigando cómo conectar una página web con una base de datos usando Node.js, porque no lo tenia muy claro al hacerlo solo

Cómo funciona (resumen)

1. Hay una página web (`index.html`) donde uno llena un formulario con los datos de un entrenamiento: jugador, potencia de tiro, velocidad y pases.
2. Esos datos se mandan a un servidor hecho en Node.js (`server.js`).
3. El servidor calcula la nota del entrenamiento con esta fórmula: Nota = (Potencia de tiro x 20%) + (Velocidad x 30%) + (Pases x 50%)
4. La nota se guarda en una base de datos en MySQL.
5. Cuando ya están los 3 entrenamientos de todos los jugadores, uno puede pedirle al programa el equipo titular, y él calcula el promedio de cada jugador y muestra los 5 mejores.

Si todavía falta algún entrenamiento por registrar, el programa avisa que no
hay suficiente información en vez de mostrar el equipo.

Archivos del proyecto

- `schema.sql`crea la base de datos en MySQL Workbench
- `server.js`el servidor, ahí está toda la lógica y los cálculos
- `public/index.html`la página web donde se registra todo
- `test.js`un test para comprobar que la fórmula esté bien calculada
- `package.json`lista de las librerías que usa el proyecto

## Pasos para ejecutar el proyecto

### Paso 1: Crear la base de datos

Abro MySQL Workbench, me conecto a mi servidor local, abro el archivo`schema.sql`, selecciono todo y le doy click al rayo para ejecutarlo. Eso crea la base de datos `futbol5` con sus tablas y ya deja cargados los 7 jugadores.

### Paso 2: Poner mi contraseña de MySQL

En el archivo `server.js` casi al principio, hay esto:

```js
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "TU_PASSWORD_AQUI",
  database: "futbol5",
};
```

Cambio `"TU_PASSWORD_AQUI"` por la contraseña que uso yo en mi Workbench.

### Paso 3: Instalar lo que el proyecto necesita

Abro una terminal en la carpeta del proyecto y escribo npm install.
```
Esto descarga 3 cosas: `express` (para el servidor), `mysql2` (para hablar con la base de datos) y `cors` (para que la página y el servidor se puedan comunicar sin que el navegador lo bloquee).

### Paso 4: Prender el servidor: npm start
```

Si todo salió bien me debe aparecer en la terminal:

```
Conectado a la base de datos futbol5 Servidor corriendo en http://localhost:3000
```

### Paso 5: Abrir la página

Con el servidor prendido, abro en el navegador:

```
http://localhost:3000
```

Ahí ya puedo registrar entrenamientos y, cuando estén completos los 3 de cada jugador, ver el equipo titular.

### (Pequeña prueba) Validar el test

```bash
node test.js
```

Esto revisa que la fórmula esté calculando bien, comparando con los ejemplos que traía el PDF de la prueba.

