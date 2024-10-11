// Función para actualizar el estado de los sensores (PIR y LDR) y el LED
function actualizarEstado() {
    // Obtener el estado del PIR y LDR desde la API
    fetch('http://4.227.157.228:8000/api/getlateststatus?esp_id=ESP32_01')  // Incluye el esp_id en la URL
        .then(response => response.json())
        .then(data => {
            console.log("Datos obtenidos:", data); // Verificar datos en la consola

            // Actualizar estado del PIR
            const pirStatus = data.pir_status == 1 ? 'Movimiento detectado' : 'No se detecta movimiento';
            document.getElementById('pir-status').innerText = pirStatus;
            document.getElementById('pir-status').style.backgroundColor = data.pir_status == 1 ? 'green' : 'gray';

            // Actualizar estado del LDR
            const ldrStatus = data.ldr_status == 1 ? 'Luz detectada' : 'Oscuridad detectada';
            document.getElementById('ldr-status').innerText = ldrStatus;
            document.getElementById('ldr-status').style.backgroundColor = data.ldr_status == 1 ? 'yellow' : 'gray';
        })
        .catch(error => {
            console.error("Error al obtener el estado del sensor:", error);
            document.getElementById('pir-status').innerText = 'Error al cargar';
            document.getElementById('ldr-status').innerText = 'Error al cargar';
        });

    // Obtener el estado actual del LED desde la API
    fetch('http://4.227.157.228:8000/api/getledstatus?esp_id=ESP32_01')  // Incluye el esp_id en la URL
        .then(response => response.json())
        .then(data => {
            console.log("Estado del LED:", data); // Verificar estado del LED en la consola
            document.getElementById('led-switch').checked = data.led_status == 1;
            document.getElementById('led-status-text').innerText = data.led_status == 1 ? 'LED encendido' : 'LED apagado';
        })
        .catch(error => {
            console.error("Error al obtener el estado del LED:", error);
            document.getElementById('led-status-text').innerText = 'Error al cargar';
        });
}

// Función para cambiar el estado del LED cuando se activa el interruptor
function toggleLED() {
    const ledState = document.getElementById('led-switch').checked ? 1 : 0;
    fetch('http://127.0.0.1:5000/api/updateled', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `esp_id=ESP32_01&led_status=${ledState}`  // Asegúrate de incluir el esp_id en el body
    })
    .then(response => {
        if (response.ok) {
            console.log("Estado del LED actualizado");
            document.getElementById('led-status-text').innerText = ledState == 1 ? 'LED encendido' : 'LED apagado';
        } else {
            console.error("Error al actualizar el estado del LED");
        }
    })
    .catch(error => {
        console.error("Error al cambiar el estado del LED:", error);
        document.getElementById('led-status-text').innerText = 'Error al actualizar';
    });
}

// Llamar a la función para actualizar el estado al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    actualizarEstado(); // Actualizar estado inmediatamente al cargar la página

    // Establecer intervalo para actualizar el estado cada 5 segundos
    setInterval(actualizarEstado, 5000);

    // Escuchar el evento de cambio en el switch del LED
    document.getElementById('led-switch').addEventListener('change', toggleLED);
});
