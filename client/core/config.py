from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
import os

from pygments.lexers import configs


class Configs(BaseSettings):
    # ------------ Веб-сервер ------------
    HOST: str = "localhost"
    PORT: int = 8002
    BOT_TOKEN: Optional[str] = Field(default="TOKEN", env="BOT_TOKEN")
    PUBLIC_URL: Optional[str] = Field(default="PUBLIC_URL", env="PUBLIC_URL")
    API_URL: Optional[str] = Field(default="API_URL", env="API_URL")


    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../..", ".env"),
        extra="ignore"
    )


configs = Configs()
