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
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ----- ИЗМЕНЕНИЕ ЗДЕСЬ -----
# Копируем все файлы и папки из текущей директории (включая main.py и handlers/)
COPY . .

# Копируем собранный фронтенд из этапа "builder"
COPY --from=builder /app/dist ./static

EXPOSE 8002
CMD ["python", "main.py"]
