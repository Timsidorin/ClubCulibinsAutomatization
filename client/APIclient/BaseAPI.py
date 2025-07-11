import httpx
from typing import Optional, Any, Dict
from client.core.config import configs


class BaseAPIClient:
    def __init__(self):
        self.base_url = configs.API_URL
        self.session = httpx.AsyncClient()

    async def _send_request(
            self,
            method: str,
            endpoint: str,
            data: Optional[Dict] = None,
            params: Optional[Dict] = None,
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

        response.raise_for_status()
        return response.json()

    async def close(self):
        await self.session.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()