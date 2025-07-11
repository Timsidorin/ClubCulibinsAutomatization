

from client.APIclient.BaseAPI import BaseAPIClient


class UserAPIClient(BaseAPIClient):
    """Класс для взаимодействия с апи Юзера"""
    async def check_user_role(self, tg_username:str)->str:
        role = await self._send_request("get", "user/get/role", data=
        {
            "tgUsername" : "@"+tg_username
        })
        return role['message']
