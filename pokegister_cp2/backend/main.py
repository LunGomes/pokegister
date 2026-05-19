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

# rota put pokemon

@app.put("/pokemons/{chave_identificadora}")
def update_pokemon(chave_identificadora: int, pokemon: Pokemon):
    for i, p in enumerate(pokemons):
        if p.get("chave_identificadora") == chave_identificadora:
            updated_pokemon = pokemon.dict()
            updated_pokemon["chave_identificadora"] = chave_identificadora
            pokemons[i] = updated_pokemon
            return updated_pokemon
    raise HTTPException(status_code=404, detail="Pokémon não encontrado")

# rota delete pokemon 

@app.delete("/pokemons/{chave_identificadora}")
def delete_pokemon(chave_identificadora: int):
    for i, p in enumerate(pokemons):
        if p.get("chave_identificadora") == chave_identificadora:
            deleted_pokemon = pokemons.pop(i)
            return {"message": "Pokémon excluído com sucesso", "pokemon": deleted_pokemon}
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

# rota put time

@app.put("/teams/{codigo_time}")
def update_team(codigo_time: int, team: Team):
    for i, t in enumerate(teams):
        if t.get("codigo_time") == codigo_time:
            updated_team = team.dict()
            if len(updated_team["pokemons"]) > 6:
                raise HTTPException(status_code=400, detail="Um time pode ter no máximo 6 pokémons")
            
            updated_team["codigo_time"] = codigo_time
            teams[i] = updated_team
            return updated_team
    raise HTTPException(status_code=404, detail="Time não encontrado")

# rota delete time

@app.delete("/teams/{codigo_time}")
def delete_team(codigo_time: int):
    for i, t in enumerate(teams):
        if t.get("codigo_time") == codigo_time:
            deleted_team = teams.pop(i)
            return {"message": "Time excluído com sucesso", "team": deleted_team}
    raise HTTPException(status_code=404, detail="Time não encontrado")