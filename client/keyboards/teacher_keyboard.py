
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton,  WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
from client.APIclient.TeacherAPIClient import TeacherAPIClient

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
    client = TeacherAPIClient()
    groups = client.get_my_groups(teacher_tg_username=username)  # берем группы из апишки
    for group in groups:
        keyboard.button(text=group, callback_data=group)
    keyboard.adjust(2)
    return keyboard