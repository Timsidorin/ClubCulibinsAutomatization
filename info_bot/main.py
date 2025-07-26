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

BOT_TOKEN = configs.TOKEN_INFO_BOT
logging.basicConfig(level=logging.INFO)

bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NotificationPayload(BaseModel):
    chat_identifier: Union[int, str]
    uuid_group: str
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


def format_member_data(member_data):
    """Форматирует данные участника для отображения"""
    try:
        user = member_data.get('User', {})
        personal_datum = user.get('PersonalDatum', {})

        name = personal_datum.get('name', 'Неизвестно')
        last_name = personal_datum.get('lastName', '')
        full_name = f"{name} {last_name}".strip()

        balance = user.get('Balance')
        if balance is not None:
            if isinstance(balance, dict):
                balance_value = balance.get('money', 0)
            else:
                balance_value = balance
        else:
            balance_value = 0

        return full_name, balance_value

    except Exception as e:
        logging.error(f"Ошибка форматирования данных участника: {e}")
        return "Ошибка данных", 0


@app.post("/send-notification")
async def send_notification_endpoint(payload: NotificationPayload):
    try:
        logging.info(f"Отправка сообщения в чат: {payload.chat_identifier}")
        client = TeacherAPIClient()
        members_response = await client.get_group_members(uuid_group=payload.uuid_group)
        members = []
        if members_response and isinstance(members_response, dict):
            message_data = members_response.get("message")
            if message_data and isinstance(message_data, dict):
                members = message_data.get("EducationGroupMembers", [])
            elif message_data and isinstance(message_data, list):
                members = message_data
        children_text = payload.text
        if members and len(members) > 0:
            try:
                header = f'{"№":<3}{"Ученик":<20}{"Баланс":>10}'
                separator = "-" * (3 + 20 + 10)
                table_rows = [header, separator]

                for i, member_data in enumerate(members, start=1):
                    try:
                        full_name, balance_value = format_member_data(member_data)

                        if len(full_name) > 19:
                            display_name = full_name[:17] + ".."
                        else:
                            display_name = full_name

                        row_text = f'{str(i) + ".":<3}{display_name:<20}{balance_value:>10}'
                        table_rows.append(row_text)

                    except Exception as member_error:
                        logging.error(f"Ошибка обработки участника {i}: {member_error}")
                        table_rows.append(f'{str(i) + ".":<3}{"Ошибка данных":<20}{"0":>10}')

                final_text = "\n".join(table_rows)
                current_time = datetime.datetime.now().strftime("%d.%m.%Y %H:%M")

                group_name = "Группа"
                if members_response and isinstance(members_response, dict):
                    message_data = members_response.get("message", {})
                    if isinstance(message_data, dict):
                        group_name = message_data.get("name", "Группа")

                children_text = f"<b>Отчёт по группе '{group_name}' на {current_time}:</b>\n<pre>{final_text}</pre>"

            except Exception as table_error:
                logging.error(f"Ошибка формирования таблицы: {table_error}")
                children_text = f"<b>{payload.text}</b>\n\nОшибка формирования отчёта: {table_error}"
        else:
            current_time = datetime.datetime.now().strftime("%d.%m.%Y %H:%M")
            children_text = f"<b>Отчёт по группе на {current_time}:</b>\n\nУчастники группы не найдены или данные недоступны."


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
