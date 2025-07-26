import logging
import asyncio
import os
from contextlib import asynccontextmanager
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from fastapi import FastAPI, Request
from aiogram import Bot, Dispatcher
from aiogram.types import Update
from starlette.staticfiles import StaticFiles
from pydantic import ValidationError

from handlers.main import router as rt
from core.create_base_app import create_base_app
from core.config import configs

logging.basicConfig(level=logging.INFO)
bot = Bot(token=configs.BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        dp.include_router(rt)
        await bot.delete_webhook(drop_pending_updates=True)
        logging.info("🔄 Webhook удален, запускаем long polling")
        
        polling_task = asyncio.create_task(
            dp.start_polling(
                bot,
                skip_updates=True,
                allowed_updates=dp.resolve_used_update_types()
            )
        )
        
        yield
        polling_task.cancel()
        try:
            await polling_task
        except asyncio.CancelledError:
            logging.info("⏹️ Polling остановлен")
            
    except Exception as e:
        logging.error(f"❌ Ошибка в lifespan: {e}")
        raise
    finally:
        try:
            await bot.session.close()
            logging.info("🔌 Bot session закрыт")
        except Exception as e:
            logging.error(f"Ошибка при закрытии сессии: {e}")

app = create_base_app(configs, lifespan=lifespan)

@app.post("/webhook")
async def telegram_webhook(request: Request):
    return {
        "ok": True, 
        "message": "Webhook disabled, using long polling mode",
        "mode": "polling"
    }


app.mount("/", StaticFiles(directory="mini_app/dist", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=configs.HOST, port=configs.PORT, reload=False)
