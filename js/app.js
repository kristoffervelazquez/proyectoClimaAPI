const resultado = document.querySelector('#resultado');
const container = document.querySelector('.container');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);

});


function buscarClima(e) {
    e.preventDefault();

    // Validar formulario
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        imprimirAlerta('Ambos campos son obligatorios');
        return;
    }

    // Consultar API
    consultarAPI(ciudad, pais)

}

function imprimirAlerta(mensaje) {

    const alerta = document.querySelector('.bg-red-100');

    if (!alerta) {
        const alerta = document.createElement('div')
        alerta.classList.add('bg-red-100', 'border-red-700', 'text-red-700', 'px-4', 'py-4', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class = "block">${mensaje}</span>

            `
        container.appendChild(alerta)
        setTimeout(() => alerta.remove(), 3000)
    }

}

function consultarAPI(ciudad, pais) {
    const apiKey = 'f58de47740ddf1f3086d767be0646e3a';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${apiKey}`
    spinner(); //Muestra el spinner

    fetch(url)
        .then(response => response.json())
        .then(datos => {
            limpiarHTML();

            
            if (datos.cod === '404') {
                imprimirAlerta('Ciudad no encontrada')
                return;
            }

            //Imprime la respuesta en el html
            mostrarClima(datos);
        })
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min } } = datos;

    const centigrados = kelvinACelsius(temp);
    const max = kelvinACelsius(temp_max);
    const min = kelvinACelsius(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.innerHTML = `Clima en ${name}`
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMaxima = document.createElement('p');
    tempMaxima.innerHTML = `Max: ${max} &#8451;`;
    tempMaxima.classList.add('text-xl');

    const tempMinima = document.createElement('p');
    tempMinima.innerHTML = `Min: ${min} &#8451;`;
    tempMinima.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);



    resultado.appendChild(resultadoDiv);
}

const kelvinACelsius = grados => parseInt(grados - 273.15);

function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function spinner() {
    limpiarHTML();
    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');
    divSpinner.innerHTML = `
    <div class="rect1"></div>
    <div class="rect2"></div>
    <div class="rect3"></div>
    <div class="rect4"></div>
    <div class="rect5"></div>
    `
    resultado.appendChild(divSpinner)
}