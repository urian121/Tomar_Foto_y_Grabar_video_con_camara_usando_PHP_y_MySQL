const tieneSoporteUserMedia = () =>
    !!(navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia)
const _getUserMedia = (...arguments) =>
    (navigator.getUserMedia || (navigator.mozGetUserMedia || navigator.mediaDevices.getUserMedia) || navigator.webkitGetUserMedia || navigator.msGetUserMedia).apply(navigator, arguments);

// Declaramos elementos del DOM
const $video = document.querySelector("#video"),
    $canvas = document.querySelector("#canvas"),
    $estado = document.querySelector("#estado"),
    $boton = document.querySelector("#boton"),
    $listaDeDispositivos = document.querySelector("#listaDeDispositivos");7
    
    video = document.getElementById('video');
    video.style.width = document.width + 'px';
    video.style.height = document.height + 'px';
    video.setAttribute('autoplay', '');
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

const limpiarSelect = () => {
    for (let x = $listaDeDispositivos.options.length - 1; x >= 0; x--)
        $listaDeDispositivos.remove(x);
};
const obtenerDispositivos = () => navigator
    .mediaDevices
    .enumerateDevices();

// La función que es llamada después de que ya se dieron los permisos
// Lo que hace es llenar el select con los dispositivos obtenidos
const llenarSelectConDispositivosDisponibles = () => {

    limpiarSelect();
    obtenerDispositivos()
        .then(dispositivos => {
            const dispositivosDeVideo = [];
            dispositivos.forEach(dispositivo => {
                const tipo = dispositivo.kind;
                if (tipo === "videoinput") {
                    dispositivosDeVideo.push(dispositivo);
                }
            });

            // Vemos si encontramos algún dispositivo, y en caso de que si, entonces llamamos a la función
            if (dispositivosDeVideo.length > 0) {
                // Llenar el select
                dispositivosDeVideo.forEach(dispositivo => {
                    const option = document.createElement('option');
                    option.value = dispositivo.deviceId;
                    option.text = dispositivo.label;
                    $listaDeDispositivos.appendChild(option);
                });
            }
        });
}

(function() {
    // Comenzamos viendo si tiene soporte, si no, nos detenemos
    if (!tieneSoporteUserMedia()) {
        alert("Lo siento. Tu navegador no soporta esta característica");
        $estado.innerHTML = "Parece que tu navegador no soporta esta característica. Intenta actualizarlo.";
        return;
    }
    //Aquí guardaremos el stream globalmente
    let stream = null;


    // Comenzamos pidiendo los dispositivos
    obtenerDispositivos()
        .then(dispositivos => {
            // Vamos a filtrarlos y guardar aquí los de vídeo
            const dispositivosDeVideo = [];

            // Recorrer y filtrar
            dispositivos.forEach(function(dispositivo) {
                const tipo = dispositivo.kind;
                if (tipo === "videoinput") {
                    dispositivosDeVideo.push(dispositivo);
                }
            });


            if (dispositivosDeVideo.length > 0) {
                mostrarStream(dispositivosDeVideo[0].deviceId);
            }
        });



    const mostrarStream = idDeDispositivo => {
        _getUserMedia({
               /* video: {
                    // Justo aquí indicamos cuál dispositivo usar
                    deviceId: idDeDispositivo,
                    facingMode: {
                        exact: 'environment'
                      } 
                } */
                
                audio: false,
                video: {
                    facingMode: 'user'
                }
                
            },
            (streamObtenido) => {
                llenarSelectConDispositivosDisponibles();

                // Escuchar cuando seleccionen otra opción y entonces llamar a esta función
                $listaDeDispositivos.onchange = () => {
                    // Detener el stream
                    if (stream) {
                        stream.getTracks().forEach(function(track) {
                            track.stop();
                        });
                    }
                    // Mostrar el nuevo stream con el dispositivo seleccionado
                    mostrarStream($listaDeDispositivos.value);
                }

                // Simple asignación
                stream = streamObtenido;

                // Mandamos el stream de la cámara al elemento de vídeo
                $video.srcObject = stream;
                $video.play();

                //Escuchar el click del botón para tomar la foto
                $boton.addEventListener("click", function() {
                    /* Apaga la camara
                    stream.getTracks().forEach(function(track) {
                      track.stop();
                    });
                    */
                     /*stream.getTracks().forEach(function(track) {
                        if (track.readyState == 'live' && track.kind === 'video') {
                            track.stop();
                        }
                     });
                     */

                    //Pausar reproducción
                    $video.pause();

                    //Obtener contexto del canvas y dibujar sobre él
                    let contexto = $canvas.getContext("2d");
                     
                     var videoElement = document.getElementById("video");
                    console.log(videoElement.videoHeight);
                    console.log(videoElement.videoWidth);

                    $canvas.width = $video.videoWidth;
                    $canvas.height = $video.videoHeight;
                    contexto.drawImage($video, 0, 0, $canvas.width, $canvas.height);

                    let foto = $canvas.toDataURL(); //Esta es la foto, en base 64
                    $("#boton").hide(); //Ocultando boton detomar foto
                    $("#btn-back").hide();//Oculto el boton de cambiar camara
                    $("#btnComenzarGrabacion").hide(); //Ocultando boton para grabar
                        
                    $estado.innerHTML = "<p style='margin: 5px !important; text-align: center;color: #ff685f;font-weight: 600;width: 90%;margin: 0 auto;padding: 10px 15px;font-size: 15px;background-color: #fff;'>Tomando foto, por favor espera...</p>";
                    fetch("static/guardar_foto.php", {
                            method: "POST",
                            body: encodeURIComponent(foto),
                            headers: {
                                "Content-type": "application/x-www-form-urlencoded",
                            }
                        })
                        .then(resultado => {
                            return resultado.text()
                        })
                        .then(nombreDeLaFoto => {
                            var track = stream.getTracks()[0]; 
                            stream.stop;
                            video.pause();
                            $("#video").hide();
                           alert('la foto fue tomada y guardada');
                           $estado.innerHTML = `<p id='msjFinal' style='margin: 5px !important; text-align: center;color: #ff685f;font-weight: 600;width: 100%;margin: 0 auto;padding: 15px 25px;font-size: 15px;background-color: #fff;'>Foto tomada con éxito.`;
                           window.location.href ='list-foto-video.php';
                        //$estado.innerHTML = `<p style='text-align: center;color: #ff685f;font-weight: 600;width: 90%;margin: 0 auto;padding: 10px 15px;font-size: 15px;background-color: #fff;'>Foto guardada con éxito, <a target='_blank' href='enviarFile.php?foto=${nombreDeLaFoto}'>enviar foto al correo</a></p>`;
         
                        setTimeout(function(){
                            console.log('esperando');
                           $("#msjFinal").hide();
                        }, 2000);
                        
                        $("#capanueva").html(`<img src='files/fotos/${nombreDeLaFoto}' style='top: 50%; left: 50%; transform: translate(-50%, -50%); width:100%; width:280px; position: absolute;z-index: -1;'>`);
                        console.log(nombreDeLaFoto);
                    
                        })

                    //Reanudar reproducción
                    $video.play();
                });
            }, (error) => {
                console.log("Permiso denegado o error: ", error);
                //$estado.innerHTML = "No se puede acceder a la cámara, o no diste permiso.";
            });
    }
})();