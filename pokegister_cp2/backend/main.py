from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Pokemon(BaseModel):
    name: str
    type: str
    weight: str
    height: str
    imagem: Optional[str] = ""
    hp: str 

class Team(BaseModel):
    name: str
    pokemons: List[str]


pokemons = []
teams = []

@app.post("/pokemons")
def create_pokemon(pokemon: Pokemon):
    new_pokemon = pokemon.dict()
    new_pokemon["chave_identificadora"] = len(pokemons) + 1
    pokemons.append(new_pokemon)
    return new_pokemon


@app.get("/pokemons")
def list_pokemons(type: Optional[str] = None, chave_identificadora: Optional[str] = None):
    res = pokemons
    if type:
        res = [p for p in res if p["type"].lower() == type.lower()]
    if chave_identificadora:
        res = [p for p in res if str(p.get("chave_identificadora")) == str(chave_identificadora)]
    return res


@app.get("/pokemons/{chave_identificadora}")
def get_pokemon(chave_identificadora: int):
    for p in pokemons:
        if p.get("chave_identificadora") == chave_identificadora:
            return p
    raise HTTPException(status_code=404, detail="Pokémon não encontrado")


@app.post("/teams")
def create_team(team: Team):
    new_team = team.dict()
    new_team["codigo_time"] = len(teams) + 1

    if len(new_team["pokemons"]) > 6:
        raise HTTPException(
            status_code=400,
            detail="Um time pode ter no máximo 6 pokémons"
        )

    teams.append(new_team)
    return new_team

@app.get("/teams")
def list_teams():
    return teams

@app.get("/teams/{codigo_time}")
def get_team(codigo_time: int):
    for t in teams:
        if t.get("codigo_time") == codigo_time:
            return t
    raise HTTPException(status_code=404, detail="Time não encontrado")