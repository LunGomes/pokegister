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

// form cadastrar favoritos

function cadastrarPokemon() {
  fetch("http://localhost:8000/pokemons", {
    method: "POST",
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
  .then(() => carregar())
  .then(() => alert("Adicionado aos favoritos!"));
}

// render favoritos

function carregar() {
  fetch("http://localhost:8000/pokemons")
    .then(res => res.json())
    .then(data => {
      document.getElementById("lista").innerHTML = "";
      
      data.forEach(p => {
        document.getElementById("lista").insertAdjacentHTML('beforeend', `
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
        `);
      });
    });
}

// form time

function criarTime() {
  fetch("http://localhost:8000/teams", {
    method: "POST",
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
  .then(() => carregarTimes())
  .then(() => {
    document.getElementById("p1").value = "";
    document.getElementById("p2").value = "";
    document.getElementById("p3").value = "";
    document.getElementById("p4").value = "";
    document.getElementById("p5").value = "";
    document.getElementById("p6").value = "";
    document.getElementById("teamName").value = "";
  })
  .then(() => alert("Time criado!"));
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
            <div class="team-header">${t.name}</div>
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
                  <div class="tcg-stats"></div>
                </div>
              `);
            })
            .catch(() => {
               document.getElementById(`team-grid-${t.codigo_time}`).insertAdjacentHTML('beforeend', `
                <div class="tcg-card">
                  <div class="tcg-header"><span>${pokeName}</span></div>
                  <div class="tcg-image-container"><span style="font-size: 2rem;">?</span></div>
                  <div class="tcg-stats"></div>
                </div>
              `);
            });
        });
      });
    });
}

carregar();
carregarTimes();