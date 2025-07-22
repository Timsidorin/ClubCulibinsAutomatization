# --- Этап 1: Сборка фронтенда ("builder") ---
FROM node:22-alpine AS builder
WORKDIR /app
COPY ./mini_app/package*.json ./
RUN npm install
COPY ./mini_app/ .
RUN npm run build

# --- Этап 2: Финальный образ с Python ("final") ---
FROM python:3.10-slim
WORKDIR /app


RUN apt-get update && apt-get install -y \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копируем и устанавливаем Python зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем только необходимые файлы приложения
COPY main.py .
COPY handlers/ ./handlers/
COPY core/ ./core/
COPY *.py ./

# Создаем директорию для статики и копируем собранный фронтенд
RUN mkdir -p ./mini_app/dist
COPY --from=builder /app/dist ./mini_app/dist

EXPOSE 8002

# Используем переменные окружения для хоста и порта
CMD ["python", "main.py"]
