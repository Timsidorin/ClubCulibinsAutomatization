
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton,  WebAppInfo

from client.core.config import configs


def create_admin_keyboard():
    return ReplyKeyboardMarkup(
    keyboard=[
        [
            KeyboardButton(
                text="Открыть админ-панель",
                web_app=WebAppInfo(url=configs.PUBLIC_URL)
            )
        ]
    ],
    resize_keyboard=True
)