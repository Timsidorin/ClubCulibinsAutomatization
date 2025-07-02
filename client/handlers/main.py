from aiogram import Router
from aiogram.filters import Command, CommandStart
from aiogram.types import Message
from client.core.config import configs
from client.keyboards.admin_keyboard import create_admin_keyboard
from client.keyboards.teacher_keyboard import create_teacher_keyboard

router = Router()





@router.message(CommandStart())
async def cmd_start(message: Message):
    chat_id = message.chat.id
    user_id = message.from_user.id
    if str(user_id) in configs.ADMIN_IDS:
        await message.answer("Привет, Админ!", reply_markup=create_admin_keyboard())
    else:
        await message.answer("Привет, Преподаватель!", reply_markup=create_teacher_keyboard())

