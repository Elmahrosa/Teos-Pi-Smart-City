"""Simple sensor simulator — publishes random telemetry to MQTT for testing."""
import time, json, random, os
import paho.mqtt.client as mqtt

BROKER = os.environ.get('MQTT_BROKER', 'localhost')
PORT = int(os.environ.get('MQTT_PORT', 1883))
TOPIC = os.environ.get('MQTT_TOPIC', 'teos/sensors/')

client = mqtt.Client()

def publish_simulated(device_id):
    payload = {
        'device_id': device_id,
        'ts': time.time(),
        'metrics': {
            'pm25': round(random.uniform(5, 200), 2),
            'noise_db': round(random.uniform(30, 110), 1),
            'traffic_index': round(random.uniform(0, 1), 3)
        },
        'location': {'lat': 30.0444, 'lng': 31.2357}
    }
    client.publish(f"{TOPIC}{device_id}", json.dumps(payload))

if __name__ == '__main__':
    client.connect(BROKER, PORT, 60)
    client.loop_start()
    try:
        while True:
            publish_simulated('device-001')
            time.sleep(2)
    except KeyboardInterrupt:
        client.loop_stop()
        client.disconnect()
