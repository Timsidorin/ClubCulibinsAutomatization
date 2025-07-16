# client/APIclient/UserAPICLient.py

from APIclient.BaseAPI import BaseAPIClient

class UserAPIClient(BaseAPIClient):
    """Класс для взаимодействия с апи Юзера"""
    async def check_user_role(self, tg_username: str) -> str:
        role_data = await self._send_request(
            "get",
            "user/get/role",
            data={"tgUsername": "@" + tg_username},
            raise_for_status=False
        )

        if not role_data:
            return "none"
        role_code = role_data.get('message')

        if role_code == '2':
            return "admin"
        elif role_code == '1':
            return "teacher"
        else:
            return "none"

