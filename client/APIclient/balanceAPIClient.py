from APIclient.BaseAPI import BaseAPIClient
from core.config import configs


class BalanceAPIClient(BaseAPIClient):
    """Класс для взаимодействия с апи Баланса"""
    def __init__(self, base_url: str = configs.INFO_BOT_URL) -> None:
        super().__init__(base_url=base_url)

    async def SendReportOfGroup(self, group_url: str, group_uuid: str) -> dict:
        """Отправка отчета по группе в чат"""
        response = await self._send_request(
            "post", 
            "/send-notification", 
            data={"uuid_group": group_uuid, "chat_identifier": group_url, "text": "OK"}
        )
        return response
