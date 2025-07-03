from client.APIclient.BaseAPI import BaseAPIClient


class AdminAPIClient(BaseAPIClient):
    """Класс для взаимодействия с апи Админа"""
    async def check_admin_status(self, username:str)->bool:
        # response = await self._send_request(
        #     "GET", "/admin/reports/daily"
        # )
        return True
    # Пока чтобы проверить логику