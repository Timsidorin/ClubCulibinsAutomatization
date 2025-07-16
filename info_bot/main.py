# main.py для бота-оповещателя

import logging
from typing import Union
from aiogram import Bot
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator
from config import configs

BOT_TOKEN = configs.BOT_TOKEN
logging.basicConfig(level=logging.INFO)

bot = Bot(token=configs.TOKEN_INFO_BOT, parse_mode="HTML")
app = FastAPI()


class NotificationPayload(BaseModel):
    chat_identifier: Union[int, str]
    text: str



@app.post("/send-notification")
async def send_notification_endpoint(payload: NotificationPayload):
    try:
        logging.info(f"Отправка сообщения в чат: {payload.chat_identifier}")

        await bot.send_message(
            chat_id=payload.chat_identifier,
            text=payload.text
        )

        return {"ok": True, "message": "Уведомление отправлено."}
    except Exception as e:
        logging.error(f"Ошибка отправки в чат {payload.chat_identifier}: {e}")
        raise HTTPException(status_code=500, detail=f"Не удалось отправить сообщение. Ошибка: {e}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=configs.HOST, port=configs.PORT)

