FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY iot/ iot/
COPY lib/ lib/
ENV PYTHONUNBUFFERED=1
CMD ["python", "iot/mqtt_listener.py"]
