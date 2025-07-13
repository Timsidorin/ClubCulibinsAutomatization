from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
from client.APIclient.TeacherAPIClient import TeacherAPIClient
from client.core.config import configs


def create_teacher_keyboard():
    return ReplyKeyboardMarkup(
        keyboard=[
            [KeyboardButton(text='Мои группы 📜')],
            [KeyboardButton(text='Главная 🏠')]
        ],
        resize_keyboard=True,
        input_field_placeholder="Выберите действие"
    )


async def create_teacher_groups_keyboard(username: str):
    keyboard = InlineKeyboardBuilder()

    client = TeacherAPIClient()
    response = await client.get_my_groups(teacher_tg_username=username)

    if not response or "message" not in response or "groups" not in response["message"]:
        raise ValueError("Некорректный ответ от API")

    groups_list = response["message"]["groups"]

    if not groups_list:
        keyboard.button(text="У вас нет групп", callback_data="no_groups")
    else:
        for group in groups_list:
            group_name = group.get("name", "Без названия")
            group_uuid = group.get("uuid", "")
            keyboard.button(text=group_name, callback_data=f"group_{group_uuid}")

    keyboard.adjust(1)
    return keyboard



def create_group_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(
        text='Список детей 🧒',
        callback_data='ga:child_list'
    )
    builder.button(
        text='Начисление/списание КК',
        callback_data='ga:ma_balance'
    )
    builder.button(
        text="Назад ↩️",
        callback_data='a:back_t_g'
    )
    builder.adjust(1, 1, 1)
    return builder.as_markup()


def create_back_to_group_actions_keyboard():
    builder = InlineKeyboardBuilder()
    builder.button(
        text="⬅️ Назад к действиям",
        callback_data="a:b_to_gr_act"
    )
    return builder.as_markup()


