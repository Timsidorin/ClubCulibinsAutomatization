

from client.APIclient.BaseAPI import BaseAPIClient


class TeacherAPIClient(BaseAPIClient):
    """Класс для взаимодействия с апи Учителя"""

    async def get_my_groups(self, teacher_tg_username: str):
        """Получение всех групп учителя"""
        groups = await self._send_request("get", "education-group/get-all", data= {"tgUsername": "@"+teacher_tg_username})
        return  groups

    async def get_group_members(self, uuid_group: str):
        members = await self._send_request("get", f"education-group/get/composition/{uuid_group}",  data={})
        return members

    async  def add_kk(self, child_tg_username:str, coins: int):
        """Добавление монет ребёнку"""
        response = await self._send_request("post", "child/add-coins", data={"child_tg_username": child_tg_username, "coins_count": coins })
        return  response


    async def reduce_kk(self, child_tg_username: str, coins: int):
        """Уменьшение монет ребёнка"""
        response = await self._send_request("post", "child/reduce-coins", data={"child_tg_username": child_tg_username, "coins_count": coins})
        return response