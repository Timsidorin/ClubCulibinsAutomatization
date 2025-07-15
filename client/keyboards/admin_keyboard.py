
from aiogram.types import KeyboardButton, WebAppInfo, InlineKeyboardMarkup, InlineKeyboardButton

from core.config import configs


def create_admin_keyboard():
    return InlineKeyboardMarkup(
        inline_keyboard=[
            [
                InlineKeyboardButton(
                    text="🚀 Открыть админ-панель",
                    web_app=WebAppInfo(url=configs.PUBLIC_URL)

                )
            ]
        ]
    )
