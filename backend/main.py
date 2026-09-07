from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import models, schemas, crud
from database import engine, get_db
from auth import verify_password, create_access_token
from deps import get_current_user
from movies import router as movies_router
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://movie-website-six-rho.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(movies_router)

@app.get("/")
def root():
    return {"message": "Movie API is running"}

@app.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    return crud.create_user(db, user)

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password" )
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/favorites", response_model=list[schemas.FavoriteOut])
def read_favorites(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return crud.get_favorites(db, current_user.id)

@app.post("/favorites", response_model=schemas.FavoriteOut)
def add_favorite(favorite: schemas.FavoriteCreate, db: Session = Depends(get_db),current_user: models.User = Depends(get_current_user)):
    existing = crud.get_favorite_by_movie(db, favorite.movie_id, current_user.id)
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    return crud.create_favorite(db, favorite, current_user.id)

@app.delete("/favorites/{movie_id}")
def remove_favorite(movie_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_fav = crud.delete_favorite(db, movie_id, current_user.id)
    if not db_fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    return {"message": "Removed from favorites"}