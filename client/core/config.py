from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
import os

from pygments.lexers import configs


class Configs(BaseSettings):
    # ------------ Веб-сервер ------------
    HOST: str = "localhost"
    PORT: int = 8002
    BOT_TOKEN: str = "7992576604:AAFSKMx88zXFk_Ba4Hhnl_i8BAU7CxscFhc"
    ADMIN_IDS: list[str] = ["1007781768"]
    PUBLIC_URL: str =  "https://reliably-precocious-hartebeest.cloudpub.ru"


    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
    )


configs = Configs()
