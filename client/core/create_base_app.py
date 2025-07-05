
from fastapi.middleware.cors import CORSMiddleware
from typing import AsyncGenerator, Callable, Optional
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from starlette.responses import HTMLResponse


def create_base_app(configs, lifespan: Optional[Callable] = None):
    app = FastAPI(
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    return app
