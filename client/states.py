# client/states.py

from aiogram.fsm.state import StatesGroup, State

class TeacherStates(StatesGroup):
    """Состояния для перехода в менюшке"""
    main_menu = State()
    choosing_group = State()
    in_group_menu = State()

    choosing_child_for_balance = State() # Пользователь выбрал "Начисление/списание" и видит список детей

    choosing_balance_action = State() # Пользователь выбрал ребенка и видит кнопки "Начислить" и "Списать"

    entering_amount_to_add = State() # Бот ожидает ввода суммы для начисления

    entering_amount_to_subtract = State() # Бот ожидает ввода суммы для списания
