from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
import os




class Configs(BaseSettings):

    HOST: str = "localhost"
    PORT: int = 8001
    TOKEN_INFO_BOT: Optional[str] = Field(default="TOKEN_INFO_BOT", env="TOKEN_INFO_BOT")


    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../", ".env"),
        extra="ignore"
    )

configs = Configs()
