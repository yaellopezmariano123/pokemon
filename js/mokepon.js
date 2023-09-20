//const { json } = require("express")

// funcion iniciar juego
const sectionSeleccionarAtaque = document.getElementById('seleccionarAtaque')
const sectionReiniciar = document.getElementById('reiniciar')
const botonMascotaJugador = document.getElementById('botonMascota')
const botonReiniciar = document.getElementById('botonReiniciar')


// funcion de selecionar mascota jugador 
const sectionSeleccionarMascota = document.getElementById('seleccionarMascota')
const spanMascotaJugador = document.getElementById('mascotaJugador')

//selecionar mascota enemigo 
const spanMascotaEnemigo = document.getElementById('mascotaEnemigo')

// funcion del combate 
const spanVidasJugador = document.getElementById ('vidasJugador')
const spanVidasEnemigo = document.getElementById('vidasEnemigo')

// funcion de crear mensaje 
const ataquesDelJugador = document.getElementById('ataques-Del-Jugador')
const ataquesDelEnemigo = document.getElementById('ataques-Del-Enemigo')

const sectionMensajes = document.getElementById('resultado')
const contenedorTarjetas = document.getElementById('contenedorTarjetas')
const contenedorAtaques = document.getElementById('contenedorAtaques')

const sectionVerMapa = document.getElementById('verMapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let mokepones = []
let mokeponesEnemigos = []
let ataqueJugador = []
let ataqueEnemigo = []
let opcionDeMokepones
let inputHipodoge
let inputCapipepo
let inputRatigueya
let mascotaJugador
let mascotaJugadorObjeto
let ataquesMokepon
let ataquesMokeponEnemigo
let botonTierra 
let botonFuego 
let botonAgua 
let botones = []
let indexAtaqueJugador
let indexAtaqueEnemigo
let victoriasJugador = 0
let victoriasEnemigo = 0
let vidasJugador = 3
let vidasEnemigo = 3
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
 mapaBackground.src = './media/imagen/mapa.png'
let alturaQueBuscamos
let anchoDelMapa = window.innerWidth -20
const anchoMaximoDelMapa = 350



if (anchoDelMapa > anchoMaximoDelMapa ) {
    anchoDelMapa = anchoMaximoDelMapa -20
}
alturaQueBuscamos = anchoDelMapa * 600/800

mapa.width = anchoDelMapa
mapa.height = alturaQueBuscamos

class Mokepon {
    constructor(nombre, foto, vida, fotoMapa, id = null) {
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 40
        this.alto = 40
        this.x = aleatorio(0,mapa.width - this.ancho) 
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = fotoMapa
        this.velocidadX = 0
        this.velocidadY = 0


    }

    pintarMokepon(){
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let hipodoge = new Mokepon('Hipodoge', 'media/imagen/picach.png', 5, './media/imagen/pika.png')

let capipepo = new Mokepon('Capipepo', 'media/imagen/charizar.png', 5, './media/imagen/char3.png')

let ratigueya = new Mokepon('Ratigueya', 'media/imagen/lavaca.png', 5, './media/imagen/cuac.png')

// push es una palabra que sirve para empuja o en este caso sirve para inyectar datos que esten adentro de este arreglo lo va empujar para juardar 
const HIPODOGE_ATAQUES = [
    {nombre: '💧', id: 'botonAgua'},
    {nombre: '💧', id: 'botonAgua'},
    {nombre: '💧', id: 'botonAgua'},
    {nombre: '🔥', id: 'botonFuego'},
    {nombre: '🌱', id: 'botonTierra'},
]

hipodoge.ataques.push(...HIPODOGE_ATAQUES)

const CAPIPEPO_ATAQUES = [
    {nombre: '🌱', id: 'botonTierra'},
    {nombre: '🌱', id: 'botonTierra'},
    {nombre: '🌱', id: 'botonTierra'},
    {nombre: '💧', id: 'botonAgua'},
    {nombre: '🔥', id: 'botonFuego'},
]

capipepo.ataques.push(...CAPIPEPO_ATAQUES)

const RATIGUEYA_ATAQUES = [
    {nombre: '🔥', id: 'botonFuego'},
    {nombre: '🔥', id: 'botonFuego'},
    {nombre: '🔥', id: 'botonFuego'},
    {nombre: '💧', id: 'botonAgua'},
    {nombre: '🌱', id: 'botonTierra'},
]

ratigueya.ataques.push(...RATIGUEYA_ATAQUES)


mokepones.push(hipodoge,capipepo,ratigueya)


function iniciarJuego() {
   
    sectionSeleccionarAtaque.style.display = 'none'
    sectionVerMapa.style.display = 'none'
    // sirve para  iterar por cuantos elementos existe en un arreglo
    mokepones.forEach((mokepon) => {
        opcionDeMokepones = `
         <input type="radio" name="mascota" id=${mokepon.nombre}>
        <label class="tarjetaDeMokepon" for=${mokepon.nombre}>
            <p>${mokepon.nombre}</p>
            <img src=${mokepon.foto} alt=${mokepon.nombre}>
        </label>
        ` 
        contenedorTarjetas.innerHTML += opcionDeMokepones

        inputHipodoge = document.getElementById('Hipodoge')
        inputCapipepo = document.getElementById('Capipepo')
        inputRatigueya = document.getElementById('Ratigueya')
    })

    sectionReiniciar.style.display = 'none'

    botonMascotaJugador.addEventListener('click', seleccionarMascotaJugador)

    


   
    botonReiniciar.addEventListener('click', reiniciarJuego )

    unirseAlJuego()
}
function unirseAlJuego() {
    fetch("http://localhost:8080/unirse")
        .then(function(res){
            if(res.ok){
                res.text()
                    .then(function(respuesta){
                        console.log(respuesta)
                        jugadorId = respuesta
                    })
            }
        })
            
        
    
}

function seleccionarMascotaJugador(){
    
    sectionSeleccionarMascota.style.display = 'none'
    
    
        if (inputHipodoge.checked) {
        spanMascotaJugador.innerHTML = inputHipodoge.id
        mascotaJugador = inputHipodoge.id
        } else if(inputCapipepo.checked){
            spanMascotaJugador.innerHTML = inputCapipepo.id
            mascotaJugador = inputCapipepo.id
        } else if(inputRatigueya.checked){
            spanMascotaJugador.innerHTML = inputRatigueya.id
            mascotaJugador = inputRatigueya.id
        } else {
            alert('selecciona una mascota')
        }


        extraerAtaques(mascotaJugador)
        sectionVerMapa.style.display = 'flex'

        iniciarMapa()

        seleccionarMokepon(mascotaJugador)
        
}

function seleccionarMokepon(mascotaJugador) {
    fetch(`http://localhost:8080/mokepon/${jugadorId}`,{
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: mascotaJugador
        })
    })
}


function extraerAtaques(mascotaJugador) {
    let ataques
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            ataques = mokepones[i].ataques
        }
        
    }

    mostrarAtaques(ataques)

}

function mostrarAtaques(ataques) {
    ataques.forEach((ataques)=> {
        ataquesMokepon =  `
        <button id=${ataques.id} class="botonAtaque BAtaque">${ataques.nombre}</button>
        `
        contenedorAtaques.innerHTML += ataquesMokepon
    })
     
     botonFuego = document.getElementById('botonFuego')
     botonAgua = document.getElementById('botonAgua')
     botonTierra = document.getElementById('botonTierra')
     botones = document.querySelectorAll('.BAtaque')

 
}

function secuenciaAtaque() {
    botones.forEach((boton) =>{
        boton.addEventListener('click', (e)=> {
            if (e.target.textContent === '🔥') {
                ataqueJugador.push('FUEGO')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }else if (e.target.textContent === '💧') {
                ataqueJugador.push('AGUA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }else {
                ataqueJugador.push('TIERRA')
                console.log(ataqueJugador)
                boton.style.background = '#112f58'
                boton.disabled = true
            }
            ataqueAleatorioEnemigo()
        })
    }) 
       
}


function seleccionarMascotaEnemigo(){
    let mascotaAleatorio = aleatorio(0, mokepones.length -1)

    spanMascotaEnemigo.innerHTML = mokepones[mascotaAleatorio].nombre
    ataquesMokeponEnemigo = mokepones[mascotaAleatorio].ataques 

    secuenciaAtaque()
}



function ataqueAleatorioEnemigo() {
    let ataqueAleatorio  = aleatorio(0, ataquesMokeponEnemigo.length -1)

    if(ataqueAleatorio == 0 || ataqueAleatorio == 1) {
        ataqueEnemigo.push('FUEGO')
    }else if (ataqueAleatorio == 3 || ataqueAleatorio == 4) {
        ataqueEnemigo.push('AGUA')
    }else {
        ataqueEnemigo.push('TIERRA')
    }
    console.log(ataqueEnemigo)
    iniciarPelea()
}

function iniciarPelea() {
    if (ataqueJugador.length === 5) {
        combate()
    }
    
}

function indexAmbosOponentes(jugador,enemigo) {
    indexAtaqueJugador = ataqueJugador[jugador]
    indexAtaqueEnemigo = ataqueEnemigo[enemigo]
}

function combate(){
    for (let index = 0; index < ataqueJugador.length; index++) {
        if (ataqueJugador[index]=== ataqueEnemigo[index]) {
            indexAmbosOponentes(index,index)
            crearMensaje("EMPATE")
        }else if (ataqueJugador[index] === 'FUEGO' && ataqueEnemigo[index] === 'TIERRA'){
            indexAmbosOponentes(index,index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador == 'AGUA' && ataqueEnemigo == 'FUEGO') {
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador
        } else if(ataqueJugador[index] == 'TIERRA' && ataqueEnemigo[index] == 'AGUA'){
            indexAmbosOponentes(index,index)
            crearMensaje("GANASTE")
            victoriasJugador++
            spanVidasJugador.innerHTML = victoriasJugador 
        } else {
            indexAmbosOponentes(index,index)
            crearMensaje("PERDISTE")
            victoriasEnemigo++
            spanVidasEnemigo.innerHTML = victoriasEnemigo      
        }
        
    }

    
    revisarVidas()
}

function revisarVidas() {
    if(victoriasJugador === victoriasEnemigo) {
        crearMensajeFinal('como es posible este sucesoo Empate')
    }else if (victoriasJugador > victoriasEnemigo){
        crearMensajeFinal('FELICITACIONES GANASTE :)')
    } else {
        crearMensajeFinal('TE GANE JA JA  JAA')
    }
}


function crearMensaje(resultado){

    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelEnemigo = document.createElement('p')

    sectionMensajes.innerHTML = resultado
    nuevoAtaqueDelJugador.innerHTML = indexAtaqueJugador 
    nuevoAtaqueDelEnemigo.innerHTML = indexAtaqueEnemigo

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelEnemigo.appendChild(nuevoAtaqueDelEnemigo)
}

function crearMensajeFinal(resultadoFinal){
   

    sectionMensajes.innerHTML = resultadoFinal


   
    sectionReiniciar.style.display = 'block'
} 

function reiniciarJuego(){
    location.reload()
}

function aleatorio(min, max){
    return Math.floor(Math.random()*(max - min + 1)+min)
}

function pintarCanvas() {

    mascotaJugadorObjeto.x = mascotaJugadorObjeto.x + mascotaJugadorObjeto.velocidadX
    mascotaJugadorObjeto.y = mascotaJugadorObjeto.y + mascotaJugadorObjeto.velocidadY
    lienzo.clearRect(0,0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaJugadorObjeto.pintarMokepon()

        enviarPosicion(mascotaJugadorObjeto.x, mascotaJugadorObjeto.y)


   mokeponesEnemigos.forEach(function(mokepon){
        mokepon.pintarMokepon()
   })

    if(mascotaJugadorObjeto.velocidadX !== 0 || mascotaJugadorObjeto.velocidadY !== 0) {
        revisarColision(hipodogeEnemeigo)
        revisarColision(capipepoEnemigo)
        revisarColision(ratigueyaEnemigo)
    }
}

function enviarPosicion(x, y){
    fetch(`http://localhost:8080/mokepon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function(res){
        if (res.ok){
            res.json()
                .then(function({ enemigos }){
                    console.log(enemigos)
                    mokeponesEnemigos = enemigos.map(function(enemigo){
                        let mokeponEnemigo = null
                        const mokeponNombre = enemigo.mokepon.nombre || ""
                        if(mokeponNombre === "Hipodoge"){
                            mokeponEnemigo = new Mokepon('Hipodoge', 'media/imagen/picach.png', 5, './media/imagen/pika.png')
                        }else if (mokeponNombre === "Capipepo"){
                            mokeponEnemigo = new Mokepon('Capipepo', 'media/imagen/charizar.png', 5, './media/imagen/char3.png') 
                        }else if (mokeponNombre === "Ratigueya"){
                            mokeponEnemigo = new Mokepon('Ratigueya', 'media/imagen/lavaca.png', 5, './media/imagen/cuac.png')
                        }

                        mokeponEnemigo.x = enemigo.x
                        mokeponEnemigo.y = enemigo.y

                        return mokeponEnemigo
                    })
                                    
                })
        }
    })
}

function moverDerecha () {
    mascotaJugadorObjeto.velocidadX = 5
}

function moverIzquierda () {
    mascotaJugadorObjeto.velocidadX = -5
}

function moverAbajo () {
    mascotaJugadorObjeto.velocidadY = 5
}

function moverArriba () {
    mascotaJugadorObjeto.velocidadY = -5
}

function detenerMovimiento() {
    mascotaJugadorObjeto.velocidadX = 0
    mascotaJugadorObjeto.velocidadY = 0
}

function sePresionoUnaTecla(event){
    switch (event.key) {
        case 'ArrowUp':
            moverArriba()
            break
        case 'ArrowDown':
            moverAbajo()
            break
        case 'ArrowLeft':
            moverIzquierda()
            break
        case 'ArrowRight':
            moverDerecha()
            break      
        default:
            break
    }
}

function iniciarMapa(){
   
    mascotaJugadorObjeto = obtenerObjetoMascota(mascotaJugador)
    console.log(mascotaJugadorObjeto, mascotaJugador);
    intervalo = setInterval(pintarCanvas, 50)

    window.addEventListener('keydown', sePresionoUnaTecla)

    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoMascota (){
    for (let i = 0; i < mokepones.length; i++) {
        if (mascotaJugador === mokepones[i].nombre) {
            return mokepones[i]
        }
        
    }
}

function revisarColision(enemigo){
    const arribaEnemigo = enemigo.y
    const abajoEnemigo = enemigo.y + enemigo.alto
    const derechaEnemigo = enemigo.x + enemigo.ancho
    const izquierdaEnemigo = enemigo.x

    const arribaMascota = 
    mascotaJugadorObjeto.y
    const abajoMascota = 
    mascotaJugadorObjeto.y + mascotaJugadorObjeto.alto
    const derechaMascota = 
    mascotaJugadorObjeto.x + mascotaJugadorObjeto.ancho
    const izquierdaMascota = 
    mascotaJugadorObjeto.x

    if(
        abajoMascota < arribaEnemigo ||
        arribaMascota > abajoEnemigo ||
        derechaMascota < izquierdaEnemigo ||
        izquierdaMascota > derechaEnemigo
    ){
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)
    sectionSeleccionarAtaque.style.display = 'flex'
    sectionVerMapa.style.display = 'none'
    seleccionarMascotaEnemigo(enemigo)
    //alert("Has colision con   " + enemigo.nombre)
}

window.addEventListener('load', iniciarJuego)