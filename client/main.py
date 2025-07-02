import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from aiogram import Bot, Dispatcher
from aiogram.types import Update
from core.config import configs



bot = Bot(token=configs.BOT_TOKEN)
dp = Dispatcher()
# dp.include_router(teacher_router)
# dp.include_router(group_router)

@asynccontextmanager
async def lifespan(app: FastAPI):
    webhook_url = f"{configs.PUBLIC_URL}/webhook"
    await bot.set_webhook(
        url=webhook_url,
        allowed_updates=dp.resolve_used_update_types(),
        drop_pending_updates=True
    )
    yield
    await bot.delete_webhook()
    await bot.session.close()

app = create_base_app(configs)
app.router.lifespan_context = lifespan
app.include_router(auth_router.router)
app.include_router(training_router.router)


@app.post("/webhook")
async def telegram_webhook(request: Request):
    update = Update.model_validate(await request.json(), context={"bot": bot})
    await dp.feed_update(bot, update)
    return {"ok": True}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=configs.HOST, port=configs.PORT, reload=True)
