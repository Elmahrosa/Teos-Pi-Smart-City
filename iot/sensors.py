"""Simple device simulator that publishes sample telemetry to an MQTT broker."""
import time
import json
import random
import os
import paho.mqtt.client as mqtt

MQTT_BROKER = os.environ.get('MQTT_BROKER', 'mosquitto')
MQTT_PORT = int(os.environ.get('MQTT_PORT', 1883))
TOPIC = os.environ.get('MQTT_TOPIC', 'teos/sensors')

def make_message(device_id):
    return {
        "device_id": device_id,
        "metrics": {
            "pm2_5": round(random.uniform(5, 150), 2),
            "noise_db": round(random.uniform(30, 100), 1),
            "temp_c": round(random.uniform(10, 40), 1)
        },
        "ts": time.time()
    }

def run(publish_interval=2):
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT)
    device_ids = [f"dev-{i:03d}" for i in range(1,6)]
    try:
        while True:
            dev = random.choice(device_ids)
            msg = make_message(dev)
            client.publish(TOPIC, json.dumps(msg))
            print('published', msg)
            time.sleep(publish_interval)
    except KeyboardInterrupt:
        client.disconnect()

if __name__ == '__main__':
    run()
