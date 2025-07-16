

from APIclient.BaseAPI import BaseAPIClient


class TeacherAPIClient(BaseAPIClient):
    """Класс для взаимодействия с апи Учителя"""

    async def get_my_groups(self, teacher_tg_username: str):
        """Получение всех групп учителя"""
        groups = await self._send_request("get", "education-group/get-all", data= {"tgUsername": "@"+teacher_tg_username})
        return  groups

    async def get_group_members(self, uuid_group: str):
        members = await self._send_request("get", f"education-group/get/composition/{uuid_group}",  data={})
        return members

    async  def add_balance(self, child_username:str, amount: int):
        """Добавление монет ребёнку"""
        response = await self._send_request("patch", "balance/update", data={"tgUsername": child_username, "operation": True, "summ": amount })
        return  True if response["code"] == 200 else False


    async def subtract_balance(self, child_username: str, amount: int):
        """Уменьшение монет ребёнка"""
        response = await self._send_request("patch", "balance/update", data={"tgUsername": child_username, "operation": False, "summ": amount})
        return  True if response["code"] == 200 else False