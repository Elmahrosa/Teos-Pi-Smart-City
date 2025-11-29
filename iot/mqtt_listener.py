"""MQTT listener that receives sensor messages and forwards to exporter."""
import os, json
import paho.mqtt.client as mqtt
from exporter import export_telemetry

BROKER = os.environ.get('MQTT_BROKER', 'localhost')
PORT = int(os.environ.get('MQTT_PORT', 1883))
TOPIC = os.environ.get('MQTT_TOPIC', 'teos/sensors/#')

def on_connect(client, userdata, flags, rc):
    print('Connected to MQTT broker, subscribing to', TOPIC)
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode('utf-8'))
        print('Received:', payload.get('device_id'))
        export_telemetry(payload)
    except Exception as e:
        print('Failed to process message', e)

if __name__ == '__main__':
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER, PORT, 60)
    client.loop_forever()
