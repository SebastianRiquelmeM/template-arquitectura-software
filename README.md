# Proyecto de Ejemplo de Arquitectura Orientada a Servicios (SOA)

Este proyecto es un ejemplo básico de una Arquitectura Orientada a Servicios (SOA) que utiliza un bus de servicios para la comunicación entre un frontend y un backend. El proyecto está estructurado utilizando Docker y Docker Compose para facilitar la puesta en marcha y el desarrollo.

## Estructura del Proyecto

El proyecto se organiza de la siguiente manera:

```
arquitectura-software/
  ├── frontend/
  │   ├── Dockerfile
  │   ├── index.js
  │   └── package.json
  ├── backend/
  │   ├── Dockerfile
  │   ├── index.js
  │   └── package.json
  └── docker-compose.yml
```

- La carpeta `frontend` contiene el código y la configuración para el servicio frontend.
- La carpeta `backend` contiene el código y la configuración para el servicio backend.
- El archivo `docker-compose.yml` en la raíz del proyecto define la configuración para levantar los servicios utilizando Docker Compose.

## Dockerfiles

Cada servicio (frontend y backend) tiene su propio `Dockerfile` que define cómo se construye la imagen de Docker para ese servicio.

Los Dockerfiles siguen una estructura similar:

1. Comienzan desde una imagen base de Node.js (node:current-alpine3.19).
2. Establecen un directorio de trabajo dentro del contenedor.
3. Copian el archivo `package.json` y ejecutan `npm install` para instalar las dependencias.
4. Copian el resto del código fuente al contenedor.
5. Especifican el comando a ejecutar cuando se inicie el contenedor.

## Docker Compose

El archivo `docker-compose.yml` define los servicios que componen la aplicación:

- El servicio `bus` utiliza una imagen predefinida (`jrgiadach/soabus:v1`) y expone el puerto 5000.
- El servicio `frontend` se construye a partir del Dockerfile ubicado en la carpeta `./frontend`. Depende del servicio `bus` y del servicio `backend`.
- El servicio `backend` se construye a partir del Dockerfile ubicado en la carpeta `./backend`. Depende del servicio `bus` y expone el puerto 3000.

Todos los servicios están conectados a una red llamada `my-network`.

## Comunicación a través del Bus

El bus de servicios actúa como intermediario para la comunicación entre el frontend y el backend.

- El frontend se conecta al bus en el puerto 5000 y envía un mensaje con un formato específico: `00012sumar120 345`.
  - Los primeros 5 caracteres representan la longitud del mensaje.
  - Los siguientes 5 caracteres representan el nombre del servicio al que se envía el mensaje.
  - El resto del mensaje son los datos que se envían.

- El backend también se conecta al bus en el puerto 5000 y escucha los mensajes entrantes.
  - Cuando recibe un mensaje, lo analiza extrayendo la longitud, el nombre del servicio y los datos.
  - Si el servicio es "sumar" y se proporcionan dos números, realiza la suma y envía una respuesta de vuelta al bus con el resultado.
  - Si hay algún error, envía una respuesta de error al bus.

## Ejecutando el Proyecto

Para ejecutar el proyecto, asegúrate de tener Docker y Docker Compose instalados en tu sistema. Luego, sigue estos pasos:

1. Clona este repositorio en tu máquina local.

2. Navega hasta el directorio raíz del proyecto.

3. Ejecuta el siguiente comando para levantar los servicios utilizando Docker Compose:

   ```
   docker-compose up
   ```

4. Los servicios se iniciarán y podrás ver los logs en la consola.

5. Para acceder a la terminal interactiva del frontend, abre otra terminal y ejecuta el siguiente comando:

   ```
   docker attach arquitectura-software-frontend-1
   ```

   Reemplaza `arquitectura-software-frontend-1` con el nombre real del contenedor frontend si es diferente en tu caso.

6. En la terminal interactiva del frontend, ingresa el primer número cuando se te solicite y presiona Enter. Luego, ingresa el segundo número y presiona Enter.

7. El frontend enviará los números al backend a través del bus, el backend los recibirá, realizará la suma y enviará una respuesta de vuelta al frontend a través del bus.

8. La respuesta se mostrará en la terminal interactiva del frontend.

9. Puedes repetir el proceso ingresando nuevos números cuando se te solicite.

10. Para salir de la terminal interactiva y detener los servicios, presiona `Ctrl+C` en la terminal donde se están ejecutando los servicios.

¡Eso es todo! Ahora tienes un ejemplo básico de una arquitectura SOA utilizando un bus de servicios para la comunicación entre un frontend y un backend, con una terminal interactiva en el frontend para ingresar números y ver las respuestas, todo ejecutándose en contenedores Docker.