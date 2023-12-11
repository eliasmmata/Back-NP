*Integración con API de WordPress para consumir Datos en formato JSON del plugin del WP-MASTER*

**SWAGGER - TEST API ROUTES**

http://localhost:3001/api/v1/docs

**PROD ROUTE**

https://back-news-api-master.up.railway.app

**DOCKER**

docker run -p 6379:6379 --name news_api_master_redis -d redis

**CACHE**

redis-commander (open interface of redis DB)


**Tecnólogías utilizadas en API**

Desarrollo de la API ( Node.js - Javascript )

Creación de una base de datos  - ( MySQL )

Manejo de Caché - Redis

**Respositorios**

https://github.com/eliasmmata/Front-NP

https://github.com/eliasmmata/Back-NP


**Utilización de API**

- Para métodos POST, PUT y DELETE necesitará de una contraseña de aplicación del Sitio Wordpress.

- Añadido al Header como request Authorization:
    -  Nombre (usuario Wp-Admin con permisos de escritura)
    -  Contraseña (contraseña de aplicación)