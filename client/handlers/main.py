from aiogram import Router
from aiogram.filters import Command, CommandStart
from aiogram.types import Message

from client.APIclient.UserAPICLient import UserAPIClient
from client.core.config import configs
from client.keyboards.admin_keyboard import create_admin_keyboard
from client.keyboards.teacher_keyboard import create_teacher_keyboard, get_my_groups
from client.APIclient.AdminAPIClient import  AdminAPIClient
from client.APIclient.TeacherAPIClient import  TeacherAPIClient
router = Router()



@router.message(CommandStart())
async def cmd_start(message: Message):
    client = UserAPIClient()
    username = message.from_user.username
    role = await client.check_user_role(username)
    if role == "admin":
        await message.answer("Привет, Админ!", reply_markup=create_admin_keyboard())
    elif role == "teacher":
        await message.answer("Привет, Преподаватель!", reply_markup=create_teacher_keyboard())


@router.message(lambda message: message.text == "Мои группы 📜")
async def show_my_groups(message: Message):
    keyboard = get_my_groups(username=message.from_user.username)
    await message.answer(
        text="Выберите текущую группу",
        reply_markup=keyboard.as_markup()
    )

