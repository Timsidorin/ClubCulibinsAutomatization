import logging
from contextlib import asynccontextmanager
import logging
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode
from fastapi import FastAPI, Request
from aiogram import Bot, Dispatcher
from aiogram.types import Update
from starlette.staticfiles import StaticFiles

from handlers.main import router as rt
from client.core.create_base_app import create_base_app
from core.config import configs

logging.basicConfig(level=logging.INFO)
bot = Bot(token=configs.BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))
dp = Dispatcher()

@asynccontextmanager
async def lifespan(app: FastAPI):
    dp.include_router(rt)
    webhook_url = f"{configs.PUBLIC_URL}/webhook"
    await bot.set_webhook(
        url=webhook_url,
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )
    logging.info("Бот запущен")
    yield
    await bot.delete_webhook()
    await bot.session.close()

app = create_base_app(configs, lifespan=lifespan)


@app.post("/webhook")
async def telegram_webhook(request: Request):
    update = Update.model_validate(await request.json(), context={"bot": bot})
    await dp.feed_update(bot, update)
    return {"ok": True}

app.mount("/", StaticFiles(directory="mini_app/dist", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=configs.HOST, port=configs.PORT, reload=True)

