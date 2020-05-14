# Image delivery microservice
A NodeJS microservice designed to deliver & resize images according to the requested resolution.

### Requirements
* NodeJS
* TypeScript
* Docker (optional)

### Dependencies
* check-disk-space (hardware disk space info)
* express (web framework)
* express-async-errors (express async error handler)
* express-status-monitor (hardware runtime info)
* express-validator (validate input params)
* sharp (resize images)

### Setup locally

#### Step 1
Install npm dependencies:
```shell script
npm install
```

#### Step 2
Build project:
```shell script
npm run build
```

#### Step 3
Run project:
```shell script
npm run start
```

#### Step 4
Access project:
`http://localhost:3000`


### API

#### /image/{image_name}[?size={resolution}]
Main endpoint that accepts two input values:
* {image_name} - **required**
    * the image name from the `/images` folder
* {size} - **optional**
    * the desired resolution, must respect standard format `{width}x{height}`
    * resizes the image from {image_name} to the desired resolution

Possible returns:
* 200 with image (resized if optional input param was used)
* 400 bad request (input validation error)
* 404 image not found (requested image was not found in folder/cache)
* 500 unexpected error

#### /stats
Returns a JSON object with some service specific metrics for monitoring purposes.

Example:
```json
{
  "cache": {
    "ttl_cached_images": 2,
    "hits": 5,
    "misses": 2
  },
  "filesystem": {
    "available_space": "76.13%",
    "original_images": 7,
    "resized_images": 2,
    "hits": 2,
    "misses": 0
  }
}
```

#### /status
This endpoint is exposed by the `express-status-monitor` library and it displays important runtime information: `cpu, mem, load, etc`


### Testing
The integration tests found in the `./tests` folder can be run by using the following command:
```shell script
npm test
```

### Running with Docker (optional)

#### Step 1
Build image and tag it with a specific name:
```shell script
docker build -t <image_name> .
```

#### Step 2
Run image and map ports
```shell script
docker run -p <local_port>:3000 -d <image_name>
```

### Planned improvements
* Use a distributed cache solution: Redis, ElastiCache, etc
* Use a HDFS for storing the images
* Replace `express-status-monitor` with an externalised monitoring solution