from aiogram import Router, F
from aiogram.filters import CommandStart, StateFilter
from aiogram.fsm.context import FSMContext
from aiogram.types import Message, CallbackQuery

from client.APIclient.UserAPICLient import UserAPIClient
from client.keyboards.admin_keyboard import create_admin_keyboard
from client.states import TeacherStates
from client.keyboards.teacher_keyboard import (
    create_teacher_keyboard,
    create_teacher_groups_keyboard,
    create_group_keyboard,
    create_back_to_group_actions_keyboard,
    create_balance_keyboard, create_children_keyboard
)
from client.APIclient.TeacherAPIClient import TeacherAPIClient
from client.utils.fio_formate import format_child

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
        members = members_response.get("message", [])["EducationGroupMembers"]

        if members:
            header = f'{"№":<4}{"Ученик":<25}{"Баланс":>12}'
            separator = "-" * (4 + 25 + 12)
            table_rows = [header, separator]

            for i, member_data in enumerate(members, start=1):
                full_string = format_child(member_data)

                try:
                    name_part, balance_part = full_string.rsplit(' <b>', 1)
                    balance = balance_part.replace('</b>', '').replace('[', '').replace(']', '')
                    row_text = f'{str(i) + ".":<4}{name_part:<25}{balance:>12}'
                    table_rows.append(row_text)

                except ValueError:
                    table_rows.append(full_string)
            final_text = "\n".join(table_rows)
            children_text = f"<b>Список детей в группе:</b>\n<pre>{final_text}</pre>"

        else:
            children_text = "В этой группе пока нет детей!"

        await callback.message.edit_text(
            text=children_text,
            reply_markup=create_back_to_group_actions_keyboard(),
            parse_mode="HTML"
        )
    except Exception as e:
        await callback.message.answer(f"Произошла ошибка при загрузке данных: {e}")
    finally:
        await callback.answer()


@router.callback_query(
    F.data == 'a:b_to_gr_act', StateFilter(TeacherStates.in_group_menu, TeacherStates.choosing_child_for_balance)
)
async def back_to_group_actions_menu(callback: CallbackQuery, state: FSMContext):
    try:
        await callback.message.edit_text(
            "Выбрана группа. Выберите действие:",
            reply_markup=create_group_keyboard()
        )
        await state.set_state(TeacherStates.in_group_menu)
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
async def children_balance_menu(callback: CallbackQuery, state: FSMContext):
    try:
        data = await state.get_data()
        group_uuid = data.get("selected_group_uuid")
        client = TeacherAPIClient()
        members_response = await client.get_group_members(uuid_group=group_uuid)
        members = members_response.get("message", {}).get("EducationGroupMembers")

        if members:
            children_list = [format_child(m).replace("<b>", "").replace("</b>", "") for m in members]
            children_usernames = [member.get("tgUsername", "none") for member in members]
            children_list_keyboard = create_children_keyboard(children_list, children_usernames)

            await callback.message.edit_text(
                "Выберите ученика:",
                reply_markup=children_list_keyboard.as_markup()
            )
            await state.set_state(TeacherStates.choosing_child_for_balance)
        else:
            await callback.message.edit_text(text="В этой группе пока нет учеников.")
            await callback.message.answer("Выберите действие:", reply_markup=create_group_keyboard())

    except Exception as e:
        await callback.message.answer(f"Произошла ошибка: {e}")
    finally:
        await callback.answer()



    @router.callback_query(F.data.startswith("child_"), TeacherStates.choosing_child_for_balance)
    async def select_child_for_balance(callback: CallbackQuery, state: FSMContext):
        try:
            selected_child_username = callback.data.split("_")[1]
            await state.update_data(selected_child_username=selected_child_username)

            await callback.message.edit_text(
                f"Выбран ученик с юзернеймом: `{selected_child_username}`\nВыберите действие:",
                reply_markup=create_balance_keyboard(),
                parse_mode="Markdown"
            )
            await state.set_state(TeacherStates.choosing_balance_action)
        finally:
            await callback.answer()


@router.callback_query(F.data == 'balance:add', TeacherStates.choosing_balance_action)
async def request_amount_to_add(callback: CallbackQuery, state: FSMContext):
    try:
        await callback.message.edit_text("Введите сумму для начисления:")
        await state.set_state(TeacherStates.entering_amount_to_add)
    finally:
        await callback.answer()


@router.callback_query(F.data == 'balance:subtract', TeacherStates.choosing_balance_action)
async def request_amount_to_subtract(callback: CallbackQuery, state: FSMContext):
    try:
        await callback.message.edit_text("Введите сумму для списания:")
        await state.set_state(TeacherStates.entering_amount_to_subtract)
    finally:
        await callback.answer()




@router.message(F.text, TeacherStates.entering_amount_to_add)
async def process_adding_amount(message: Message, state: FSMContext):
    if not message.text.isdigit() or int(message.text) <= 0:
        await message.answer("Ошибка. Пожалуйста, введите целое положительное число.")
        return

    amount = int(message.text)
    data = await state.get_data()
    child_username = data.get("selected_child_username")

    client = TeacherAPIClient()
    response = await client.add_balance(child_username=child_username, amount=amount)
    if response:
        await message.answer(f"✅ Успешно начислено `{amount}` КК ученику `{child_username}`.", parse_mode="Markdown")
        await message.answer(
            "Вы снова в меню группы. Выберите следующее действие:",
            reply_markup=create_group_keyboard()
        )
        await state.set_state(TeacherStates.in_group_menu)
    else:
        await message.answer("Ошибка начисления, попробуйте еще раз")



@router.message(F.text, TeacherStates.entering_amount_to_subtract)
async def process_subtracting_amount(message: Message, state: FSMContext):
    if not message.text.isdigit() or int(message.text) <= 0:
        await message.answer("Ошибка. Пожалуйста, введите целое положительное число.")
        return

    amount = int(message.text)
    data = await state.get_data()
    child_username = data.get("selected_child_username")

    client = TeacherAPIClient()
    if await client.subtract_balance(child_username=child_username, amount=amount):
        await message.answer(f"✅ Успешно списано `{amount}` КК у ученика `{child_username}`.", parse_mode="Markdown")
        await message.answer(
            "Вы снова в меню группы. Выберите следующее действие:",
            reply_markup=create_group_keyboard()
        )
        await state.set_state(TeacherStates.in_group_menu)
    else:
        await message.answer("Ошибка списания, попробуйте еще раз")



@router.callback_query(F.data == 'back_to_child_list', TeacherStates.choosing_balance_action)
async def back_to_child_list_from_balance_menu(callback: CallbackQuery, state: FSMContext):
    await children_balance_menu(callback, state)






