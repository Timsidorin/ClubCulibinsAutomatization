
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton,  WebAppInfo

from client.core.config import configs


def create_teacher_keyboard():
    btn1 = KeyboardButton(text='Мои группы')
    btn2 = KeyboardButton(text='Мое расписание')
    return ReplyKeyboardMarkup(
        keyboard=[[btn1], [btn2]],
        resize_keyboard=True
    )
