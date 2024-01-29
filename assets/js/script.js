// PAGINA CON DATOS
const apiURL = "https://mindicador.cl/api/";

let graficar;

// FUNCION PARA OBTENER LOS DATOS
async function getConversion() {
    const data = await fetch(apiURL);
    const converterData = await data.json();
    return converterData;
}

// Obtener elementos del DOM
const inputNumber = document.getElementById("inputID");
const selectMoneda = document.getElementById("listaDesplegable");
const section3 = document.querySelector('.section3');

// Evento click del botón
document.querySelector('button').addEventListener('click', async () => {
    try {

        const datos = await getConversion();
        const monedaSeleccionada = selectMoneda.value;
        const valorMoneda = datos[monedaSeleccionada].valor;
        const cantidad = parseFloat(inputNumber.value);
        if (isNaN(cantidad)) {
            alert("Vuelve a ingresar los datos");
            return;
        }

        const resultado = cantidad / valorMoneda;
        section3.innerHTML = `<h3>Resultado: ${resultado.toFixed(2)}</h3>`;
        getGraficar(monedaSeleccionada);

    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
});


async function grafico(x) {
    const res = await fetch("https://mindicador.cl/api/" + x);
    const valor = await res.json();

    let keyValue = Object.keys(valor['serie']);
    let contarkey = keyValue.length;

    let data = [];
    let labels = [];

    for (let i = 0; i < contarkey; i++) {
        let coin = valor['serie'][i].fecha;
        let newDate = coin.split('T'); // Separar la fecha
        data.push(valor['serie'][i].valor);
        labels.push(newDate[0]);
        if (i >= 9)
            break;
    }

    labels.reverse(); //FECHA MAS ANTIGUA A LA IZQUIERDA

    // Estructura de datos para el gráfico
    const datasets = [
        {
            label: "Valor " + x,
            borderColor: "red",
            data
        }
    ];
    return {labels, datasets};
}

async function getGraficar(x) {
    try {

        const data = await grafico(x);


        const config = {
            type: "line",
            data: {
                labels: data.labels,
                datasets: data.datasets
            },
            options: {
                plugins: {
                    title: {
                        display: true,
                        text: 'Historial de Valor ' + x  // TITULO DEL GRAFICO
                    },
                    legend: {
                        display: true,
                        position: 'right' // lA LEYENDA QUEDA A LA DERECHA
                    }
                }
            }
        };


        let myChart = document.getElementById("chart");
        if (graficar)
            graficar.destroy();

        myChart.style.backgroundColor = "white";
        graficar = new Chart(myChart, config);
    }  catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

