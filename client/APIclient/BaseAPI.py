import httpx
import ssl
import logging
from typing import Optional, Any, Dict
from core.config import configs

logger = logging.getLogger(__name__)

class BaseAPIClient:
    def __init__(self, base_url: str = configs.API_URL) -> None:
        self.base_url = base_url.rstrip('/')
        
        # Настройка SSL для самоподписанных сертификатов
        if self.base_url.startswith('https'):
            ssl_context = ssl.create_default_context()
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE
            
            self.session = httpx.AsyncClient(
                timeout=30.0,
                verify=ssl_context
            )
        else:
            self.session = httpx.AsyncClient(timeout=30.0)

    async def _send_request(
            self,
            method: str,
            endpoint: str,
            data: Optional[Dict] = None,
            params: Optional[Dict] = None,
            raise_for_status: bool = True
    ) -> Any:
        endpoint = endpoint.lstrip('/')
        url = f"{self.base_url}/{endpoint}"

        logger.debug(f"🔗 {method.upper()} request to: {url}")

        request_params = params
        request_json = data

        if method.lower() == 'get' and data:
            request_params = data
            request_json = None

        try:
            response = await self.session.request(
                method=method,
                url=url,
                json=request_json,
                params=request_params
            )

            logger.debug(f"✅ Response status: {response.status_code}")

            if raise_for_status:
                response.raise_for_status()

            try:
                return response.json()
            except Exception as json_error:
                logger.warning(f"⚠️ Non-JSON response from {url}")
                return None

        except httpx.RequestError as e:
            logger.error(f"❌ Request error to {url}: {e}")
            return None
        except httpx.HTTPStatusError as e:
            logger.error(f"❌ HTTP error {e.response.status_code} for {url}: {e}")
            return None

    async def health_check(self) -> bool:
        """Проверка доступности API"""
        try:
            response = await self._send_request('GET', '/health', raise_for_status=False)
            return response is not None
        except Exception:
            return False

    async def close(self):
        await self.session.aclose()

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()
