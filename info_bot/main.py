# main.py для бота-оповещателя
import datetime
import logging
from typing import Union
from aiogram import Bot
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, field_validator

from APIclient.TeacherAPIClient import TeacherAPIClient
from config import configs
from fastapi.middleware.cors import CORSMiddleware

from utils.fio_formate import format_child

BOT_TOKEN = configs.TOKEN_INFO_BOT
logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
app = FastAPI()

origins = [
    "http://localhost"
    "http://localhost:5173"
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class NotificationPayload(BaseModel):
    chat_identifier: Union[int, str]
    uuid_group:str
    text: str

    @field_validator('chat_identifier')
    @classmethod
    def format_chat_identifier(cls, v: Union[int, str]) -> Union[int, str]:
        if isinstance(v, int):
            return v
        if isinstance(v, str):
            if 't.me/' in v:
                v = v.split('t.me/')[-1]
            v = v.lstrip('+')
            if not v.startswith('@'):
                v = f'@{v}'
        return v


@app.post("/send-notification")
async def send_notification_endpoint(payload: NotificationPayload):
    try:
        logging.info(f"Отправка сообщения в чат: {payload.chat_identifier}")

        client = TeacherAPIClient()
        members_response = await client.get_group_members(uuid_group=payload.uuid_group)
        members = members_response.get("message", [])["EducationGroupMembers"]

        if members:
            header = f'{"№":<3}{"Ученик":<18}{"Баланс":>8}'
            separator = "-" * (3 + 18 + 8)
            table_rows = [header, separator]

            for i, member_data in enumerate(members, start=1):
                full_string = format_child(member_data)
                try:
                    name_part, balance_part = full_string.rsplit(' <b>', 1)
                    balance = balance_part.replace('</b>', '').replace('[', '').replace(']', '')
                    if len(name_part) > 17:
                        name_part = name_part[:15] + ".."

                    row_text = f'{str(i) + ".":<3}{name_part:<18}{balance:>8}'
                    table_rows.append(row_text)
                except ValueError:
                    table_rows.append(full_string)

            final_text = "\n".join(table_rows)
            current_time = datetime.datetime.now().strftime("%d.%m.%Y %H:%M")
            children_text = f"<b>Отчёт по группе на {current_time}:</b>\n<pre>{final_text}</pre>"

        await bot.send_message(
            chat_id=payload.chat_identifier,
            text=children_text
        )

        return {"ok": True, "message": "Уведомление отправлено."}
    except Exception as e:
        logging.error(f"Ошибка отправки в чат {payload.chat_identifier}: {e}")
        raise HTTPException(status_code=500, detail=f"Не удалось отправить сообщение. Ошибка: {e}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=configs.HOST, port=configs.PORT)

