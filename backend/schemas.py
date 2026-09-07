from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class FavoriteCreate(BaseModel):
    movie_id: int
    title: str
    poster_path: Optional[str] = None

class FavoriteOut(BaseModel):
    id: int
    movie_id: int
    title: str
    poster_path: Optional[str] = None
    owner_id: int

    class Config:
        from_attributes = True