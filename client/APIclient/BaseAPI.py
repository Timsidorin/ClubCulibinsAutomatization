import httpx
from typing import Optional, Any, Dict
from core.config import configs


class BaseAPIClient:
    def __init__(self, base_url: str = configs.API_URL) -> None:
        self.base_url = base_url
        self.session = httpx.AsyncClient()

    async def _send_request(
            self,
            method: str,
            endpoint: str,
            data: Optional[Dict] = None,
            params: Optional[Dict] = None,
            raise_for_status: bool = True
    ) -> Any:
        url = f"{self.base_url}{endpoint.lstrip('/')}"
        request_params = params
        request_json = data
        if method.lower() == 'get' and data:
            request_params = data
            request_json = None

        response = await self.session.request(
            method=method,
            url=url,
            json=request_json,
            params=request_params
        )

        if raise_for_status:
            response.raise_for_status()
        try:
            return response.json()
        except Exception:
            return None

    async def close(self):
        await self.session.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()
