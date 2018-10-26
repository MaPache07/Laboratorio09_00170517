const http = require('http'),
  fs = require('fs'),
  url = require('url'),
  {
    parse
  } = require('querystring');

mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
};

//Pregunta 1: Dar una mayor eficiencia en las conexiones web.
//Pregunta 2: La manipulacion de los archivos del sistema.
//Pregunta 3: Es una manera de identificar archivos en internet por su naturaleza y formato.

http.createServer((req, res)=>{ 
    var pathname = url.parse(req.url).pathname;
    if(pathname == "/"){
          pathname = "../index.html";
    }
    if(pathname == "../index.html"){
        fs.readFile(pathname, (err, data)=>{
            if (err) {
                console.log(err);
                // HTTP Status: 404 : NOT FOUND
                // En caso no haberse encontrado el archivo
                res.writeHead(404, {
                    'Content-Type': 'text/html'
                });       
                return res.end("404 Not Found");     
            }
            // Pagina encontrada
            // HTTP Status: 200 : OK
                
            res.writeHead(200, {
                'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
            });
                
            // Escribe el contenido de data en el body de la respuesta.
            res.write(data.toString());
                
                
            // Envia la respuesta 
            return res.end();
        });
    } 
        
    if(req.method === 'POST' && pathname == '/cv'){ 
        collectRequestData(req, (err, result) => { 
            if (err) { 
                res.writeHead(400, { 
                    'content-type': 'text/html' 
                }); 
                return res.end('Bad Request'); 
            } 
            fs.readFile("../templates/plantilla.html", function (err, data) {
                if (err) {
                    console.log(err);
                    // HTTP Status: 404 : NOT FOUND
                    // Content Type: text/plain
                    res.writeHead(404, {
                        'Content-Type': 'text/html'
                    });
                    return res.end("404 Not Found");
                }

                res.writeHead(200, {
                    'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/html'
                });
        
                //Variables de control. 
        
                let parsedData = data.toString().replace('${dui}', result.dui) 
                .replace("${lastname}", result.lastname) 
                .replace("${firstname}", result.firstname) 
                .replace("${gender}", result.gender) 
                .replace("${civilStatus}", result.civilStatus) 
                .replace("${birth}", result.birth) 
                .replace("${exp}", result.exp) 
                .replace("${tel}", result.tel) 
                .replace("${std}", result.std); 
        
                res.write(parsedData); 
                return res.end(); 
            });
        }); 
    } 
        
    if(pathname.split(".")[1] == "css"){ 
        fs.readFile(".."+pathname, (err, data)=>{
        if (err) {
            console.log(err);
            res.writeHead(404, {
                'Content-Type': 'text/html'
            });       
            return res.end("404 Not Found");     
        }
        res.writeHead(200, {
            'Content-Type': mimeTypes[pathname.split('.').pop()] || 'text/css'
        });
        // Escribe el contenido de data en el body de la respuesta.
        res.write(data.toString());
    
        // Envia la respuesta 
        return res.end();
      });
    }
    }).listen(8081);

function collectRequestData(request, callback) { 
    const FORM_URLENCODED = 'application/x-www-form-urlencoded'; 
    if (request.headers['content-type'] === FORM_URLENCODED) { 
        let body = ''; 
        // Evento de acumulacion de data. 
        request.on('data', chunk => { 
            body += chunk.toString(); 
        }); 
        // Data completamente recibida 
        request.on('end', () => { 
            callback(null, parse(body)); 
        }); 
    } 
    else { 
        callback({ 
            msg: `The content-type don't is equals to ${FORM_URLENCODED}` 
        }); 
    } 
}

//Pregunta 4: La req contiene la peticion, y la res la respuesta.
//Pregunta 5: Falla si el puerto esta ocupado.
//Pregunta 6: Se utiliza para pedir/extraer datos.
//Pregunta 7: Para la busqueda de archivos
//Pregunta 8: Almacena la informacion del archivo al path.
//Pregunta 9: En que el HTML devuelve el esqueleto, mientras que el CSS devuelve el estilo del esqueleto (carne, color de piel, color de ojos, si es flaco o gordo :v)
//Pregunta 10: Un paquete HTTP
//Pregunta 11: Porque algunos parametros deben convertirse a string como el DUI o el numero.
//Pregunta 12: Si habria diferencia porque no tendria estilo la pagina del curriculum Vitae
//Pregunta 13: No, porque el HTML esta ligado a ese js en esa carpeta.
//Pregunta 14: Para poder entender porque funcionan las cosas y asi poder estar preparado para cualquier tipo de modulos.