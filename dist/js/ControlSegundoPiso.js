// Función para actualizar el estado de los sensores (nivel de agua, metal detectado, temperatura) y los LEDs
function actualizarEstado() {
    // Obtener el estado de los sensores desde la API para ESP32_02
    fetch('http://4.227.157.228:8000/api/getlateststatus?esp_id=ESP32_02')  // Incluye el esp_id en la URL
        .then(response => response.json())
        .then(data => {
            console.log("Datos obtenidos:", data); // Verificar datos en la consola

            // Actualizar estado del nivel de agua
            const nivelAguaStatus = data.nivel_agua == 1 ? 'Nivel de agua alto' : 'Nivel de agua bajo';
            document.getElementById('nivel-agua-status').innerText = nivelAguaStatus;

            // Actualizar estado del metal detectado
            const metalStatus = data.metal_detectado == 1 ? 'Metal detectado' : 'No se detecta metal';
            document.getElementById('metal-status').innerText = metalStatus;

            // Actualizar estado de la temperatura
            const temperaturaStatus = `Temperatura: ${data.temperatura}°C`;
            document.getElementById('temperatura-status').innerText = temperaturaStatus;
        })
        .catch(error => {
            console.error("Error al obtener el estado del sensor:", error);
            document.getElementById('nivel-agua-status').innerText = 'Error al cargar';
            document.getElementById('metal-status').innerText = 'Error al cargar';
            document.getElementById('temperatura-status').innerText = 'Error al cargar';
        });

    // Obtener el estado actual de los LEDs desde la API
    fetch('http://4.227.157.228:8000/api/getledstatus?esp_id=ESP32_02')  // Incluye el esp_id en la URL
        .then(response => response.json())
        .then(data => {
            console.log("Estado de los LEDs:", data); // Verificar estado de los LEDs en la consola
            document.getElementById('led1-switch').checked = data.led1_status == 1;
            document.getElementById('led1-status').innerText = data.led1_status == 1 ? 'LED 1 encendido' : 'LED 1 apagado';

            document.getElementById('led2-switch').checked = data.led2_status == 1;
            document.getElementById('led2-status').innerText = data.led2_status == 1 ? 'LED 2 encendido' : 'LED 2 apagado';
        })
        .catch(error => {
            console.error("Error al obtener el estado de los LEDs:", error);
            document.getElementById('led1-status').innerText = 'Error al cargar';
            document.getElementById('led2-status').innerText = 'Error al cargar';
        });
}

// Función para cambiar el estado de los LEDs cuando se activa el interruptor
function toggleLED(ledNumber) {
    const ledState = document.getElementById(`led${ledNumber}-switch`).checked ? 1 : 0;
    fetch('http://127.0.0.1:5000/api/updateled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `esp_id=ESP32_02&led${ledNumber}_status=${ledState}`  // Asegúrate de incluir el esp_id y el led que se va a actualizar
    })
    .then(response => {
        if (response.ok) {
            console.log(`Estado del LED ${ledNumber} actualizado`);
            document.getElementById(`led${ledNumber}-status`).innerText = ledState == 1 ? `LED ${ledNumber} encendido` : `LED ${ledNumber} apagado`;
        } else {
            console.error(`Error al actualizar el estado del LED ${ledNumber}`);
        }
    })
    .catch(error => {
        console.error(`Error al cambiar el estado del LED ${ledNumber}:`, error);
        document.getElementById(`led${ledNumber}-status`).innerText = `Error al actualizar el LED ${ledNumber}`;
    });
}

// Llamar a la función para actualizar el estado al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    actualizarEstado(); // Actualizar estado inmediatamente al cargar la página

    // Establecer intervalo para actualizar el estado cada 5 segundos
    setInterval(actualizarEstado, 5000);

    // Escuchar el evento de cambio en el switch del LED 1
    document.getElementById('led1-switch').addEventListener('change', function() {
        toggleLED(1);  // Cambia el estado del LED 1
    });

    // Escuchar el evento de cambio en el switch del LED 2
    document.getElementById('led2-switch').addEventListener('change', function() {
        toggleLED(2);  // Cambia el estado del LED 2
    });
});
