from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from typing import Optional
import os

from pygments.lexers import configs


class Configs(BaseSettings):
    # ------------ Настройки проекта ------------
    PROJECT_NAME: str = "Конструктор Тренингов"
    PROJECT_DESCRIPTION: str = "веб-сервис Конструктор тренингов."

    # ------------ Веб-сервер ------------
    HOST: str = "localhost"
    PORT: int = 8002
    BOT_TOKEN: str = "Токен бота"


    model_config = SettingsConfigDict(
        env_file=os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env")
    )


configs = Configs()
