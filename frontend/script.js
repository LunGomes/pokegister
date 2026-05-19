let editandoPokemonId = null;
let editandoTimeId = null;

// form buscar pokemon
function buscarPokemonAPI() {
  fetch(`https://pokeapi.co/api/v2/pokemon/${document.getElementById("nomePokemon").value.toLowerCase().trim()}`)
    .then(res => {
      if (!res.ok) throw new Error("Pokémon não encontrado!");
      return res.json();
    })
    .then(data => {
      document.getElementById('preview-name').innerText = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      document.getElementById('preview-hp').innerText = `HP ${data.stats.find(s => s.stat.name === 'hp').base_stat}`;
      document.getElementById('preview-type').innerText = `Type: ${data.types.map(t => t.type.name).join(', ')}`;
      document.getElementById('preview-weight').innerText = `Weight: ${(data.weight / 10).toFixed(1)} kg`;
      document.getElementById('preview-height').innerText = `Height: ${(data.height / 10).toFixed(1)} m`;
      
      document.getElementById('preview-image').innerHTML = `<img src="${data.sprites.other['official-artwork'].front_default || data.sprites.front_default}" alt="${data.name}">`;

      document.getElementById("name").value = data.name.charAt(0).toUpperCase() + data.name.slice(1);
      document.getElementById("type").value = data.types.map(t => t.type.name).join(', ');
      document.getElementById("weight").value = (data.weight / 10).toFixed(1) + " kg";
      document.getElementById("height").value = (data.height / 10).toFixed(1) + " m";
      
      document.getElementById("name").setAttribute("data-img", data.sprites.other['official-artwork'].front_default || data.sprites.front_default);
      document.getElementById("name").setAttribute("data-hp", `HP ${data.stats.find(s => s.stat.name === 'hp').base_stat}`);
    })
    .catch(err => alert(err.message));
}

// form cadastrar ou editar favoritos 

function salvarPokemon() {
  const url = editandoPokemonId ? `http://localhost:8000/pokemons/${editandoPokemonId}` : "http://localhost:8000/pokemons";
  const method = editandoPokemonId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      type: document.getElementById("type").value,
      weight: document.getElementById("weight").value,
      height: document.getElementById("height").value,
      imagem: document.getElementById("name").getAttribute("data-img") || "",
      hp: document.getElementById("name").getAttribute("data-hp") || "HP --"
    })
  })
  .then(() => {
    carregar();
    editandoPokemonId = null;
    document.getElementById("btnSalvarPokemon").innerText = "Salvar na Pokedex";
    
    document.getElementById("name").value = "";
    document.getElementById("type").value = "";
    document.getElementById("weight").value = "";
    document.getElementById("height").value = "";
    
    alert(method === "PUT" ? "Pokémon atualizado!" : "Adicionado aos favoritos!");
  });
}

// deletar pokemon 

function deletarPokemon(id) {
  if(confirm("Deseja realmente excluir este Pokémon?")) {
    fetch(`http://localhost:8000/pokemons/${id}`, { method: "DELETE" })
      .then(() => carregar());
  }
}

// edição pokemon

function prepararEdicaoPokemon(id) {
  fetch(`http://localhost:8000/pokemons/${id}`)
    .then(res => {
      if(!res.ok) throw new Error("Erro ao buscar dados na API");
      return res.json();
    })
    .then(data => {
      document.getElementById("name").value = data.name;
      document.getElementById("type").value = data.type;
      document.getElementById("weight").value = data.weight;
      document.getElementById("height").value = data.height;
      document.getElementById("name").setAttribute("data-img", data.imagem);
      document.getElementById("name").setAttribute("data-hp", data.hp);
      
      document.getElementById('preview-name').innerText = data.name;
      document.getElementById('preview-hp').innerText = data.hp;
      document.getElementById('preview-type').innerText = `Type: ${data.type}`;
      document.getElementById('preview-weight').innerText = `Weight: ${data.weight}`;
      document.getElementById('preview-height').innerText = `Height: ${data.height}`;
      document.getElementById('preview-image').innerHTML = `<img src="${data.imagem}" alt="${data.name}">`;
      
      editandoPokemonId = id;
      document.getElementById("btnSalvarPokemon").innerText = "Atualizar Pokémon";

      document.querySelector('.result-area').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => alert("Erro no Javascript: " + err.message));
}

// render favoritos

function carregar() {
  fetch("http://localhost:8000/pokemons")
    .then(res => res.json())
    .then(data => {
      document.getElementById("lista").innerHTML = "";
      
      data.forEach(p => {
        document.getElementById("lista").insertAdjacentHTML('beforeend', `
          <div>
            <div class="tcg-card">
              <div class="tcg-header">
                <span>${p.name}</span>
                <span class="tcg-hp">${p.hp} ⭐</span>
              </div>
              <div class="tcg-image-container">
                <img src="${p.imagem || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png'}" alt="${p.name}">
              </div>
              <div class="tcg-stats">
                Type: ${p.type}<br>Weight: ${p.weight}<br>Height: ${p.height}
              </div>
            </div>
            
            <div class="card-actions" style="display: flex; justify-content: center; gap: 10px; margin-top: 10px;">
              <button class="btn-action btn-edit" onclick="prepararEdicaoPokemon(${p.chave_identificadora})">
                <i class="fa-solid fa-pen-to-square" style="color:#dd1111;"></i>
              </button>
              <button class="btn-action btn-delete" onclick="deletarPokemon(${p.chave_identificadora})">
                <i class="fa-regular fa-trash-can" style="color:#dd1111;"></i>
              </button>
            </div>
          </div>
        `);
      });
    });
}

// filtro por id

function buscarPorId() {
  fetch(`http://localhost:8000/pokemons/${document.getElementById("buscarId").value}`)
    .then(res => {
      if (!res.ok) throw new Error("Pokémon não encontrado na base.");
      return res.json();
    })
    .then(data => {
      document.getElementById("lista").innerHTML = `
        <div>
          <div class="tcg-card">
            <div class="tcg-header">
              <span>${data.name}</span>
              <span class="tcg-hp">${data.hp} ⭐</span>
            </div>
            <div class="tcg-image-container">
              <img src="${data.imagem || ''}" alt="${data.name}">
            </div>
            <div class="tcg-stats">
              Type: ${data.type}<br>Weight: ${data.weight}<br>Height: ${data.height}
            </div>
          </div>
          
          <div class="card-actions">
            <button class="btn-action btn-edit" onclick="prepararEdicaoPokemon(${data.chave_identificadora})">
              <i class="fa-solid fa-pen-to-square"></i>
            </button> 
            
            <button class="btn-action btn-delete" onclick="deletarPokemon(${data.chave_identificadora})">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </div>
      `;
    })
    .catch(err => alert(err.message));
}

// filtro tipo pokemon

function filtrar() {
  fetch(`http://localhost:8000/pokemons?type=${document.getElementById("filtroTipo").value}`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("lista").innerHTML = "";
      
      data.forEach(p => {
        document.getElementById("lista").insertAdjacentHTML('beforeend', `
          <div>
            <div class="tcg-card">
              <div class="tcg-header">
                <span>${p.name}</span>
                <span class="tcg-hp">${p.hp} ⭐</span>
              </div>
              <div class="tcg-image-container">
                <img src="${p.imagem || ''}" alt="${p.name}">
              </div>
              <div class="tcg-stats">
                Type: ${p.type}<br>Weight: ${p.weight}<br>Height: ${p.height}
              </div>
            </div>
             <div class="card-actions">
              <button class="btn-action btn-delete" onclick="deletarPokemon(${p.chave_identificadora})">
                <i class="fa-regular fa-trash-can style="color: #dc3545;""></i>
              </button>
              <button class="btn-action btn-edit" onclick="prepararEdicaoPokemon(${p.chave_identificadora})">
                <i class="fa-solid fa-pen-to-square style="color: #dc3545;""></i>
              </button>
            </div>
          </div>
        `);
      });
    });
}

// form salvar time 

function salvarTime() {
  const url = editandoTimeId ? `http://localhost:8000/teams/${editandoTimeId}` : "http://localhost:8000/teams";
  const method = editandoTimeId ? "PUT" : "POST";

  fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("teamName").value,
      pokemons: [
        document.getElementById("p1").value,
        document.getElementById("p2").value,
        document.getElementById("p3").value,
        document.getElementById("p4").value,
        document.getElementById("p5").value,
        document.getElementById("p6").value
      ].filter(Boolean)
    })
  })
  .then(() => {
    carregarTimes();
    editandoTimeId = null;
    document.getElementById("btnSalvarTime").innerText = "Registrar Equipe";
    
    for(let i=1; i<=6; i++) document.getElementById(`p${i}`).value = "";
    document.getElementById("teamName").value = "";
    
    alert(method === "PUT" ? "Time atualizado!" : "Time criado!");
  });
}

// deletar time 
function deletarTime(id) {
  if(confirm("Deseja realmente excluir esta Equipe?")) {
    fetch(`http://localhost:8000/teams/${id}`, { method: "DELETE" })
      .then(() => carregarTimes());
  }
}

// edição time

function prepararEdicaoTime(id) {
  fetch(`http://localhost:8000/teams/${id}`)
    .then(res => {
      if(!res.ok) throw new Error("Erro ao buscar dados na API");
      return res.json();
    })
    .then(data => {
      document.getElementById("teamName").value = data.name;
      
      for(let i=1; i<=6; i++) document.getElementById(`p${i}`).value = "";
      
      for(let i=0; i<data.pokemons.length; i++) {
        document.getElementById(`p${i+1}`).value = data.pokemons[i] || "";
      }
      
      editandoTimeId = id;
      document.getElementById("btnSalvarTime").innerText = "Atualizar Equipe";

      document.querySelector('.create-team-area').scrollIntoView({ behavior: 'smooth' });
    })
    .catch(err => alert("Erro no Javascript: " + err.message));
}

// render times

function carregarTimes() {
  fetch("http://localhost:8000/teams")
    .then(res => res.json())
    .then(data => {
      document.getElementById("listaTimes").innerHTML = "";
      
      data.forEach(t => {

        document.getElementById("listaTimes").insertAdjacentHTML('beforeend', `
          <div class="team-container" id="team-${t.codigo_time}">
            
            <div class="team-header" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
              <span>${t.name}</span>
              
              <span class="team-actions" style="display: flex; gap: 10px; align-items: center;">
                <i class="fa-solid fa-pen-to-square" onclick="prepararEdicaoTime(${t.codigo_time})" style="cursor: pointer; color: white;" title="Editar Time"></i>
                <i class="fa-regular fa-trash-can" onclick="deletarTime(${t.codigo_time})" style="cursor: pointer; color: white;" title="Excluir Time"></i>
              </span>
            </div>

            <div class="team-body">
              <div class="team-grid" id="team-grid-${t.codigo_time}">
              </div>
            </div>
          </div>
        `);
        
        t.pokemons.forEach(pokeName => {
          fetch(`https://pokeapi.co/api/v2/pokemon/${pokeName.toLowerCase().trim()}`)
            .then(r => r.json())
            .then(pokeData => {
              document.getElementById(`team-grid-${t.codigo_time}`).insertAdjacentHTML('beforeend', `
                <div class="tcg-card">
                  <div class="tcg-header">
                    <span>${pokeData.name.charAt(0).toUpperCase() + pokeData.name.slice(1)}</span>
                  </div>
                  <div class="tcg-image-container">
                    <img src="${pokeData.sprites.other['official-artwork'].front_default || pokeData.sprites.front_default}" alt="${pokeData.name}">
                  </div>
                  <div class="tcg-stats" style="display: none;"></div>
                </div>
              `);
            })
            .catch(() => {
               document.getElementById(`team-grid-${t.codigo_time}`).insertAdjacentHTML('beforeend', `
                <div class="tcg-card">
                  <div class="tcg-header"><span>${pokeName}</span></div>
                  <div class="tcg-image-container"><span style="font-size: 2rem;">?</span></div>
                  <div class="tcg-stats" style="display: none;"></div>
                </div>
              `);
            });
        });
      });
    });
}

carregar();
carregarTimes();