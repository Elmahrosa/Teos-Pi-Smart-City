FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt ./requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
COPY ai/ ai/
COPY lib/ lib/
ENV PYTHONUNBUFFERED=1
CMD ["python", "ai/classifier.py"]
