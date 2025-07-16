
def format_child(member_data: dict) -> str:
    personal_data = member_data.get('User', {}).get('PersonalDatum', {})
    balance_money = (member_data.get('User', {}).get('Balance', {})).get('money', 0)
    last_name = personal_data.get('lastName', '')
    first_name = personal_data.get('name', '')
    second_name = personal_data.get('secondName', '')

    initial_f = f"{first_name[0:1]}.".upper() if first_name else ""
    initial_s = f"{second_name[0:1]}.".upper() if second_name else ""
    return f"{last_name} {initial_f} {initial_s}  <b>[{balance_money} KK]</b>".strip().replace("  ", " ")

