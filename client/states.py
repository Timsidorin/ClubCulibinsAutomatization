from aiogram.fsm.state import StatesGroup, State


class TeacherStates(StatesGroup):
    """Состояния для перехода в менюшке"""
    main_menu = State()
    choosing_group = State()
    in_group_menu = State()
    in_balance_menu = State()

