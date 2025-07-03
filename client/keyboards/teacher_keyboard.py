
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton,  WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder

from client.core.config import configs


def create_teacher_keyboard():
    btn1 = KeyboardButton(text='Мои группы 📜')
    btn2 = KeyboardButton(text='Мое расписание')
    return ReplyKeyboardMarkup(
        keyboard=[[btn1], [btn2]],
        resize_keyboard=True
    )


def get_my_groups(username:str):
    keyboard = InlineKeyboardBuilder()
    groups = ["Юные Инженеры", "Строители"] # берем группы из апишки

    for group in groups:
        keyboard.button(text=group, callback_data=group)
    keyboard.adjust(2)
    return keyboard