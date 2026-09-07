from fastapi import APIRouter, HTTPException
import httpx
from config import TMDB_API_KEY, TMDB_BASE_URL

router = APIRouter(prefix="/movies", tags=["movies"])

headers = {
    "Authorization": f"Bearer {TMDB_API_KEY}",
    "accept": "application/json"
}

@router.get("/trending")
async def get_trading():
    async with httpx.AsyncClient() as client: 
        res = await client.get(f"{TMDB_BASE_URL}/trending/movie/week", headers=headers)
        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail="TMDB request failed")
        return res.json()

@router.get("/popular")
async def get_popular():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"{TMDB_BASE_URL}/movie/popular", headers=headers)
        if res.status_code != 200:
                    raise HTTPException(status_code=res.status_code, detail="TMDB request failed")
        return res.json()

@router.get("/search")
async def search_movies(query: str):
    async with httpx.AsyncClient() as client:
        res = await client.get(
             f"{TMDB_BASE_URL}/search/movie",
             headers=headers,
             params={"query": query}
        )
        if res.status_code != 200:
            raise HTTPException(status_code=res.status_code, detail="TMDB request failed")
        return res.json()

@router.get("/{movie_id}")
async def get_movie_detail(movie_id: int):
    async with httpx.AsyncClient() as client:
        res = await client.get(
            f"{TMDB_BASE_URL}/movie/{movie_id}",
            headers=headers,
            params={"append_to_response": "credits"},
        )

        if res.status_code != 200:
            raise HTTPException(
                status_code=res.status_code,
                detail="Movie not found",
            )

        return res.json()