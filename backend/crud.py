from sqlalchemy.orm import Session
import models, schemas
from auth import hash_password

def get_user_by_username(db:Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_pw = hash_password(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_favorites(db: Session, owner_id: int):
    return db.query(models.Favorite).filter(models.Favorite.owner_id == owner_id).all()

def get_favorite_by_movie(db: Session, movie_id: int, owner_id: int):
    return db.query(models.Favorite).filter(
        models.Favorite.movie_id == movie_id,
        models.Favorite.owner_id == owner_id
    ).first()

def create_favorite(db: Session, favorite: schemas.FavoriteCreate, owner_id: int):
    db_fav = models.Favorite(**favorite.dict(), owner_id=owner_id)
    db.add(db_fav)
    db.commit()
    db.refresh(db_fav)
    return db_fav

def delete_favorite(db: Session, movie_id: int, owner_id: int):
    db_fav = get_favorite_by_movie(db, movie_id, owner_id)
    if db_fav:
        db.delete(db_fav)
        db.commit()
    return db_fav