"""MQTT listener that consumes telemetry and optionally forwards to exporter."""
import os, json
import paho.mqtt.client as mqtt
from exporter import write_telemetry

MQTT_BROKER = os.environ.get('MQTT_BROKER', 'mosquitto')
MQTT_PORT = int(os.environ.get('MQTT_PORT', 1883))
TOPIC = os.environ.get('MQTT_TOPIC', 'teos/sensors')

def on_connect(client, userdata, flags, rc):
    print('connected with rc', rc)
    client.subscribe(TOPIC)

def on_message(client, userdata, msg):
    payload = json.loads(msg.payload.decode('utf-8'))
    print('received', payload)
    # write_telemetry expects dict with device_id, metrics, ts
    try:
        write_telemetry(payload)
    except Exception as e:
        print('failed to write telemetry:', e)

def run():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(MQTT_BROKER, MQTT_PORT)
    client.loop_forever()

if __name__ == '__main__':
    run()
