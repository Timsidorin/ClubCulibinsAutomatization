FROM python:3.10-slim

WORKDIR /app

# ✅ Correct path from root context
COPY ./info_bot/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ✅ Copy info_bot source code
COPY ./info_bot/ .

# ✅ Copy shared dependencies
COPY ./client/APIclient/ ./APIclient/
COPY ./client/core/ ./core/

EXPOSE 8001

CMD ["python", "main.py"]
