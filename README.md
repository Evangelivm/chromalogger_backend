# Instrucciones para Configurar el Proyecto

## Clonar el Repositorio

```bash
git clone https://github.com/Evangelivm/chromalogger_backend
```

## Instalar Redis en WSL (si no está instalado)

```bash
curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt-get update
sudo apt-get install redis
```

## Instalar Docker y Docker Compose en WSL y en la PC

Encender los servicios de Docker y Docker Compose:

```bash
sudo service docker start
```

## Iniciar el Servidor de Redis en WSL

```bash
sudo service redis-server start
redis-server
```

## Crear un Archivo `.env`

Coloca las siguientes variables de entorno en el archivo `.env`:

```
DATABASE_URL=
REDIS_HOST=localhost
REDIS_PORT=6379
TCP_HOST=127.0.0.1
TCP_PORT=1234
```

> **Nota**: Los datos son de ejemplo.

## Desactivar el Modo Protegido de Redis

```bash
redis-cli
CONFIG SET protected-mode no
```

## Comunicación entre WSL y la PC

Dado que WSL es un entorno virtual, necesita comunicarse con los puertos de la PC. Usa el siguiente comando:

```bash
cat /etc/resolv.conf
```

Lo que aparezca después de `nameserver` debe ser configurado como la IP del datalogger.

### Puertos de Redis

Revisar la IP del host con:

```bash
ip addr show eth0
```

La dirección que aparece después de `inet` es la IP de Redis.

## Levantar los Contenedores de Docker

Antes de levantar los contenedores, crea una red compartida:

```bash
docker network create shared_network
```

### Secuencia para Iniciar Contenedores

1. Inicia el `docker-compose` de la base de datos (en la carpeta "db").
2. Luego inicia Redis (quitar el modo protegido).
3. Finalmente, levanta el backend.
   Si es la primera vez iniciando los contenedores, usa este comando:

```bash
docker-compose up --build
```

Caso contrario, usa este comando:

```bash
docker-compose up
```

Traten de siempre tener las colas de redis limpias para evitar trabas
