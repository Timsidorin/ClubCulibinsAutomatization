
FROM node:22-alpine AS builder
WORKDIR /app
COPY ./mini_app/package*.json ./
RUN npm install
COPY ./mini_app/ .
RUN npm run build

FROM python:3.10-slim
WORKDIR /app


COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY main.py .
COPY handlers/ ./handlers/
COPY core/ ./core/
COPY APIclient/ ./APIclient/
COPY keyboards/ ./keyboards/
COPY utils/ ./utils/
COPY *.py ./


RUN mkdir -p ./mini_app/dist
COPY --from=builder /app/dist ./mini_app/dist

EXPOSE 8002

CMD ["python", "main.py"]
