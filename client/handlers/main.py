from aiogram import Router, F
from aiogram.filters import CommandStart
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, CallbackQuery

from client.APIclient.UserAPICLient import UserAPIClient
from client.keyboards.admin_keyboard import create_admin_keyboard
from client.states import TeacherStates
from client.keyboards.teacher_keyboard import (
    create_teacher_keyboard,
    create_teacher_groups_keyboard,
    create_group_keyboard,
    create_back_to_group_actions_keyboard
)
from client.APIclient.TeacherAPIClient import TeacherAPIClient
from client.utils.fio_formate import format_fio

router = Router()

@router.message(CommandStart())
async def cmd_start(message: Message, state: FSMContext):
    client = UserAPIClient()
    username = message.from_user.username
    role = await client.check_user_role(username)
    if role == "admin":
        await message.answer("Привет, Админ!", reply_markup=create_admin_keyboard())
        await state.clear()
    elif role == "teacher":
        await message.answer("Привет, Преподаватель!", reply_markup=create_teacher_keyboard())
        await state.set_state(TeacherStates.main_menu)



@router.message(F.text == "Главная 🏠")
async def back_to_main_menu(message: Message, state: FSMContext):
    await message.answer(
        "Вы вернулись в главное меню.",
        reply_markup=create_teacher_keyboard()
    )
    await state.set_state(TeacherStates.main_menu)



@router.message(F.text == "Мои группы 📜", TeacherStates.main_menu)
async def show_my_groups(message: Message, state: FSMContext):
    keyboard = await create_teacher_groups_keyboard(username=message.from_user.username)
    await message.answer("Выберите группу:", reply_markup=keyboard.as_markup())
    await state.set_state(TeacherStates.choosing_group)



@router.callback_query(F.data.startswith("group_"), TeacherStates.choosing_group)
async def select_group_callback(callback: CallbackQuery, state: FSMContext):
    try:
        group_uuid = callback.data.split("_")[1]
        await state.update_data(selected_group_uuid=group_uuid)
        await callback.message.edit_text(
            "Выбрана группа. Выберите действие:",
            reply_markup=create_group_keyboard()
        )
        await state.set_state(TeacherStates.in_group_menu)
    finally:
        await callback.answer()


@router.callback_query(F.data == 'ga:child_list', TeacherStates.in_group_menu)
async def get_children_list(callback: CallbackQuery, state: FSMContext):
    await callback.answer(text="Загружаю список...")
    data = await state.get_data()
    group_uuid = data.get("selected_group_uuid")

    if not group_uuid:
        await callback.message.answer("Ошибка: не удалось определить группу. Попробуйте снова.")
        return

    try:
        client = TeacherAPIClient()
        members_response = await client.get_group_members(uuid_group=group_uuid)
        members = (members_response.get("message", [])["EducationGroupMembers"])

        if members:
            children_list = "\n".join(
                f"{x}) {format_fio(m)}" for x,m in enumerate(members, start=1)
            )
            children_text = f"<b>Список детей в группе:</b>\n{children_list}"
        elif not members:
            children_text = "В этой группе пока нет детей!"

        await callback.message.edit_text(
            text=children_text,
            reply_markup=create_back_to_group_actions_keyboard(),
            parse_mode="HTML"
        )
    except Exception as e:
        await callback.message.answer(f"Произошла ошибка при загрузке данных: {e}")



@router.callback_query(F.data == 'a:b_to_gr_act', TeacherStates.in_group_menu)
async def back_to_group_actions_menu(callback: CallbackQuery):
    try:
        await callback.message.edit_text(
            "Выбрана группа. Выберите действие:",
            reply_markup=create_group_keyboard()
        )
    finally:
        await callback.answer()


@router.callback_query(F.data == 'a:back_t_g', TeacherStates.in_group_menu)
async def back_to_group_selection(callback: CallbackQuery, state: FSMContext):
    try:
        keyboard = await create_teacher_groups_keyboard(username=callback.from_user.username)
        await callback.message.edit_text(
            "Выберите группу:",
            reply_markup=keyboard.as_markup()
        )
        await state.set_state(TeacherStates.choosing_group)
    finally:
        await callback.answer()


@router.callback_query(F.data == 'ga:ma_balance', TeacherStates.in_group_menu)
async def back_to_group_actions_menu(callback: CallbackQuery, state: FSMContext):
    try:
        await callback.message.edit_text(
            "Начисление/списание. Выберите действие:",
            reply_markup=create_group_keyboard()
        )
        await state.set_state(TeacherStates.in_balance_menu)

    finally:
        await callback.answer()
