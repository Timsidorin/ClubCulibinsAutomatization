

from client.APIclient.BaseAPI import BaseAPIClient


class UserAPIClient(BaseAPIClient):
    """Класс для взаимодействия с апи Юзера"""
    async def check_user_role(self, tg_username)->str:
        role = await self._send_request("get", "user/check_role", data=
        {
            "tg_username" : tg_username
        })
        return str(role)
