;(function(){
    'use strict'

    var palabras = [
        'AUTO',
        'PERRO',
        'AVION',
        'AUDIFONO',
        'COMPUTADORA',
        'ANIMAL'
    ]

    // Variable para almacenar la configuracion actual
    var juego = null
    // Para ver si ya se ha enviado alguna alerta
    var finalizado = false


    var $html = {
        hombre: document.getElementById('hombre'),
        adivinado: document.querySelector('.adivinado'),
        errado: document.querySelector('.errado')
    }

    function dibujar(juego) {
        // Actualizar la imagen del hombre
        var $elem
        $elem = $html.hombre

        var estado = juego.estado
        if(estado === 8) {
            estado = juego.previo
        }
        $elem.src = './img/state/0' + estado + '.png'

        // Creamos las letras a adivinar
        var palabra = juego.palabra
        let adivinado = juego.adivinado
        $elem = $html.adivinado
        // Borramos los elementos anteriores
        $elem.innerHTML = ""
        for (let letra of palabra) {
            let $span = document.createElement('span')
            let $txt = document.createTextNode('')
            if (adivinado.has(letra)) {
                $txt.nodeValue = letra
            }
            $span.setAttribute('class', 'letra adivinada')
            $span.appendChild($txt)
            $elem.appendChild($span)
        }

        // Creamos las letras erradas
        var errado = juego.errado
        $elem = $html.errado
        // Borramos los elementos anteriores
        $elem.innerHTML = ""
        for (let letra of errado) {
            let $span = document.createElement('span')
            let $txt = document.createTextNode(letra)
            $span.setAttribute('class', 'letra errada')
            $span.appendChild($txt)
            $elem.appendChild($span)
        }
    }

    function adivinar(juego, letra){
        var estado = juego.estado
        //Si se ha perdido o ganado no hay que hacer nada
        if (estado === 1 || estado === 8){
            return
        }

        var adivinado = juego.adivinado
        var errado = juego.errado
        //Si ya hemos adivinado o errado la letra, no hacer nada
        if (adivinado.has(letra) || errado.has(letra)) {
            return
        }

        var palabra = juego.palabra
        var letras = juego.letras
        // Si es letra de la palabra
        if (letras.has(letra)) {
            // Agregamos a la lista de letras adivinadas
            adivinado.add(letra)
            // Actualizamos
            juego.restante --

            // Si ya se ha ganado, debemos indicarlo
            if (juego.restante === 0) {
                juego.previo = juego.estado
                juego.estado = 8
            } 
        } else {
            // Si no es letra de la palabra, acercamos al hombre un paso mas de su ahorcado
            juego.estado --
            // Agregamos la letra a la lista de letras erradas
            errado.add(letra)
        }
    }

    window.onkeypress = function adivinarLetra(e){
        var letra = e.key
        letra = letra.toUpperCase()
        if(/[^A-ZÑ]/.test(letra)){
            return
        }
        adivinar(juego, letra)
        var estado = juego.estado
        if (estado === 8 && !finalizado) {
            setTimeout(alertaGanado, 0)
            finalizado = true
        }else if (estado === 1 && !finalizado) {
            setTimeout(alertaPerdido, 0)


            finalizado = true
        }
        dibujar(juego)
    }

    window.nuevoJuego = function nuevoJuego(){
        var palabra = palabraAleatoria()
        juego = {}
        juego.palabra = palabra
        juego.estado = 7
        juego.adivinado = new Set()
        juego.errado = new Set()
        finalizado = false

        var letras = new Set()
        for (let letra of palabra) {
            letras.add(letra)
        }
        juego.letras = letras
        juego.restante = letras.size

        dibujar(juego)
        console.log(juego)
    }

    
    function palabraAleatoria() {
        var index = Math.trunc(Math.random() * palabras.length)
        return palabras[index]
    }

    function alertaGanado(){
        alert("Felicidades ganaste!")        
    }

    function alertaPerdido(){
        let palabra = juego.palabra
        alert("Lo siento, perdiste... la palabra era: " + palabra)
    }

    nuevoJuego()

}());

function desistir(){
    let respuesta = confirm("¿Estás seguro de desistir?")
    if(respuesta == true) {
        nuevoJuego()
    }
}