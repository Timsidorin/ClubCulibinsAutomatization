FROM python:3.10-slim

WORKDIR /app


COPY ./info_bot/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


COPY ./info_bot/ .

COPY ./client/APIclient/ ./APIclient/
COPY ./client/core/ ./core/

EXPOSE 8001

CMD ["python", "main.py"]
