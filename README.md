# Gym Routine Mobile Web

Aplicación web ligera en modo oscuro para iPhone (y otros móviles) que permite gestionar la rutina del gimnasio en cuatro días numerados. En la pantalla inicial se puede elegir entre dos usuarios (**San** o **Luchi**) y los ejercicios quedan guardados en una base de datos SQLite accesible desde cualquier dispositivo mediante una pequeña API en Node/Express.

## Uso

1. Instalar dependencias (requiere acceso a internet): `npm install`.
2. Iniciar el servidor: `npm start` y abrir `http://localhost:3000` en el navegador móvil o de escritorio.
3. Elegir el usuario (San o Luchi) en la pantalla inicial.
4. Cambiar de día usando los botones (Día 1, Día 2, Día 3, Día 4) en la parte superior.
5. Completar el formulario con *Ejercicio*, *Series*, *Repeticiones* y *Peso* para agregar un nuevo ejercicio a ese día. Para modificarlo, pulsa “Editar” en la lista, ajusta los valores y luego “Guardar”.
6. Para eliminar un ejercicio, usa el botón “Eliminar”.
7. Los datos se guardan en la base de datos y son accesibles desde cualquier dispositivo que apunte al mismo servidor.
