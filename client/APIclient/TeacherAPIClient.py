from APIclient.BaseAPI import BaseAPIClient


class TeacherAPIClient(BaseAPIClient):
    """Класс для взаимодействия с апи Учителя"""

    async def get_my_groups(self, teacher_tg_username: str):
        """Получение всех групп учителя"""
        try:
            groups = await self._send_request(
                "get",
                "education-group/get-all",
                data={"tgUsername": "@" + teacher_tg_username}
            )
            return groups
        except Exception as e:
            print(f"Ошибка в get_my_groups: {e}")
            return None

    async def get_group_members(self, uuid_group: str):
        """Получение участников группы"""
        try:
            members = await self._send_request(
                "get",
                f"education-group/get/composition/{uuid_group}",
                data={}
            )
            return members
        except Exception as e:
            print(f"Ошибка в get_group_members: {e}")
            return None

    async def add_balance(self, child_username: str, teacher_username: str, amount: int):
        """Добавление монет ребёнку"""
        try:
            print(f"Отправляю запрос на добавление баланса: {child_username}, {teacher_username}, {amount}")

            response = await self._send_request(
                "patch",
                "balance/update",
                data={
                    "tgUsername": child_username,
                    "tgTeacher": "@" + teacher_username,
                    "operation": True,
                    "summ": amount
                }
            )

            if response and response.get("message", {}).get("code") == 200:
                return True
            else:
                return False

        except Exception as e:
            print(f"Ошибка в add_balance: {e}")
            return False

    async def subtract_balance(self, child_username: str, teacher_username: str, amount: int):
        """Уменьшение монет ребёнка"""
        try:
            print(f"Отправляю запрос на списание баланса: {child_username}, {teacher_username}, {amount}")

            response = await self._send_request(
                "patch",
                "balance/update",
                data={
                    "tgUsername": child_username,
                    "tgTeacher": "@" + teacher_username,
                    "operation": False,
                    "summ": amount
                }
            )


            if response and response.get("message", {}).get("code") == 200:
                return True
            else:
                return False

        except Exception as e:
            print(f"Ошибка в subtract_balance: {e}")
            return False
