const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const MQTT_BROKER = 'mqtts://1956694161de4eb899ebb06b4935709e.s1.eu.hivemq.cloud:8883';
const MQTT_USER = 'catherine';
const MQTT_PASS = 'Catherine1';
const MQTT_TOPIC = 'esp32/dht22';

const mqttClient = mqtt.connect(MQTT_BROKER, {
  username: MQTT_USER,
  password: MQTT_PASS
});

mqttClient.on('connect', () => {
  console.log('Connected to HiveMQ Cloud');
  mqttClient.subscribe(MQTT_TOPIC);
});

mqttClient.on('message', (topic, message) => {
  const data = JSON.parse(message.toString());
  io.emit('sensorData', data); // send data to browser
});

// Serve frontend
app.use(express.static('public'));

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));