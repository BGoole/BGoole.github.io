// If project is finished then go through all the requirements on itslearning and check them 1 by 1.

// Global variables
let offset = 0;

document.getElementById("previous").style.display = "none";

//Queries
// 20 pokemon zichtbaar met naam, id, afbeelding, klikken opent detail. && paginatie
// https://pokeapi.co/api/v2/pokemon?limit=20&offset=0
const loadPokemon = async (btn) => {
  if (btn !== undefined) {
    if (btn.value == "next") {
      offset = offset + 20;
    } else if (btn.value == "prev") {
      if (offset == 0) {
        return alert("cant go back");
      } else {
        offset = offset - 20;
      }
    }
  }

  if (offset !== 0) {
    document.getElementById("previous").style.display = "block";
  } else {
    document.getElementById("previous").style.display = "none";
  }

  if (document.querySelector(".pokemonhomeWrapper").children.length !== 1) {
    document.querySelector(".pokemonhomeWrapper").remove();
    let pokemonhomeWrapper = document.createElement("div");
    pokemonhomeWrapper.classList.add("pokemonhomeWrapper");
    document.querySelector('.container').insertBefore(pokemonhomeWrapper, document.querySelector(".page-control-wrap"));
    // document.querySelector(".page-control-wrap").prepend(pokemonhomeWrapper);
  }

  let url = "https://pokeapi.co/api/v2/pokemon?limit=20&offset=" + offset;
  let pokemonData = [];

  try {
    let res = await fetch(url);
    const json = await res.json();

    // load the data and add classes;
    pokemonData = json.results;
  } catch (error) {
    console.log(error);
  }

  pokemonData.forEach((pokemon, index) => {
    if (document.getElementById("loading")) {
      document.getElementById("loading").remove();
    }
    let homeSinglePokemonWrap = document.createElement("div");
    let pokemonSprite = document.createElement("img");
    let homePokemonTxtWrap = document.createElement("div");
    let homePokemonName = document.createElement("p");
    let homePokemonId = document.createElement("p");

    let splitedURL = pokemon.url.split("/");

    let id = splitedURL[splitedURL.length - 2];

    homeSinglePokemonWrap.classList.add("home-single-pokemon-wrap");
    homePokemonTxtWrap.classList.add("home-pokemon-text-wrap");
    homePokemonName.innerText = pokemon.name;
    homePokemonId.innerText = "#" + id;
    homePokemonTxtWrap.append(homePokemonName, homePokemonId);
    pokemonSprite.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    homeSinglePokemonWrap.append(homePokemonTxtWrap, pokemonSprite);

    homeSinglePokemonWrap.addEventListener("click", async (e) => {
      detailsPokemon(await singlePokemonCall(pokemon.url));
    });
    document.querySelector(".pokemonhomeWrapper").append(homeSinglePokemonWrap);
  });
};
const singlePokemonCall = async (url) => {
  try {
    let singleRes = await fetch(url);
    let json = await singleRes.json();
    return json;
  } catch (err) {
    console.log(err);
  }
};
loadPokemon();
//Details
const detailsPokemon = (pokemon) => {
  // if detailWrap already exist then delete and do all this all over again
  if (document.getElementById("detailWrap") !== null) {
    document.getElementById("detailWrap").remove();
  }
  // the detailWrap has 3 rows
  // 1: info and stats
  // 2: evolution chain
  // 3: navigation
  let detailWrap = document.createElement("div");
  detailWrap.classList.add("detail-wrap");
  detailWrap.setAttribute("id", "detailWrap");
  // detailWrap.id = "detailWrap";

  let closeBtn = document.createElement("p");
  closeBtn.classList.add("close");
  closeBtn.innerText = "x";
  closeBtn.addEventListener("click", () => {
    document.getElementById("detailWrap").remove();
    return 0;
  });
  detailWrap.append(closeBtn);

  let informationRow = document.createElement("div");
  informationRow.setAttribute("id", "basicInfo");
  // informationRow.id = "basicInfo";
  let evolutionChainRow = document.createElement("div");
  evolutionChainRow.setAttribute("id", "evolutionChainRow");
  // evolutionChainRow.id = "evolutionChainRow";
  let navigationRow = document.createElement("div");
  // navigationRow.id = "navigationRow";
  navigationRow.setAttribute("id", "navigationRow");

  detailWrap.append(informationRow, evolutionChainRow, navigationRow);

  let basicInfo = document.createElement("div");
  basicInfo.classList.add("name-and-sprite");

  let nameAndId = document.createElement("div");
  nameAndId.classList.add("name-and-id", "infohead");
  let name = document.createElement("p");
  let id = document.createElement("p");

  name.innerText = pokemon.name;
  id.innerText = "#" + pokemon.id;
  nameAndId.append(name, id);

  let spriteWrap = document.createElement("div");
  let sprite = document.createElement("img");
  sprite.classList.add("sprite");
  sprite.id = pokemon.id;
  sprite.src = pokemon.sprites.front_default;

  let spriteControl = document.createElement("div");
  spriteControl.classList.add('sprite-btn-control');
  // Buttons to rotate or shinify the sprite A.K.A. change sprite
  let spriteShiny = document.createElement("button");
  spriteShiny.innerText = "SHINY";
  spriteShiny.addEventListener("click", () =>
    spriteShinyChange(pokemon, sprite.src, sprite)
  );

  let spriteDirection = document.createElement("button");
  spriteDirection.innerText = "DIRECTION";
  spriteDirection.addEventListener("click", () =>
    spriteDirectionChange(pokemon, sprite.src, sprite)
  );

  spriteControl.append(spriteShiny, spriteDirection);
  spriteWrap.append(sprite);
  basicInfo.append(nameAndId, spriteWrap, spriteControl);

  let typesAndAbilitiesWrap = document.createElement("div");
  typesAndAbilitiesWrap.classList.add("types-and-abilities-wrap");
  //loop through the types and append to typesWrap
  let typesWrap = document.createElement("div");
  typesWrap.classList.add("types-wrap");
  let typesHeader = document.createElement("p");
  let allTypesWrapper = document.createElement("div");
  allTypesWrapper.classList.add("AllTypesWrapper");
  typesHeader.classList.add("types-header", "infohead");
  typesHeader.innerText = "TYPES";

  typesWrap.append(typesHeader, allTypesWrapper);
  pokemon.types.forEach((el, inx) => {
    let singleType = document.createElement("div");
    let typeIcon = document.createElement("img");
    let typeName = document.createElement("p");

    singleType.classList.add(el.type.name);
    singleType.classList.add("single-type");
    typeIcon.src = `icons/${el.type.name}.svg`;
    typeName.innerText = el.type.name;
    singleType.append(typeIcon, typeName);
    allTypesWrapper.append(singleType);
  });

  let abilitiesWrap = document.createElement("div");
  abilitiesWrap.classList.add("abilities");
  let abilitiesHeader = document.createElement("p");
  let allAbilitiesWrapper = document.createElement("div");
  allAbilitiesWrapper.classList.add("abilitiesWrapper");

  abilitiesHeader.classList.add("abilities-header", "infohead");
  abilitiesHeader.innerText = "ABILITIES";
  abilitiesWrap.append(abilitiesHeader, allAbilitiesWrapper);
  pokemon.abilities.forEach((el, inx) => {
    let singleAbility = document.createElement("div");
    let abilityName = document.createElement("p");
    abilityName.innerText = el.ability.name;
    singleAbility.append(abilityName);
    if (inx !== pokemon.abilities.length - 1) {
      let hr = document.createElement("hr");
      allAbilitiesWrapper.append(singleAbility, hr);
    } else {
      allAbilitiesWrapper.append(singleAbility);
    }
  });

  typesAndAbilitiesWrap.append(typesWrap, abilitiesWrap);

  // loop through the stats and append to statsWrap
  let statsWrap = document.createElement("div");
  let statsWrapHeader = document.createElement("p");
  let stats = document.createElement("div");
  statsWrap.classList.add("stats-wrap");
  statsWrapHeader.classList.add("stats-header", "infohead");
  statsWrapHeader.innerText = "STATS";
  stats.classList.add("stats");
  statsWrap.append(statsWrapHeader, stats);

  pokemon.stats.forEach((el, inx) => {
    let singleStat = document.createElement("div");
    let statName = document.createElement("p");
    let baseStat = document.createElement("p");
    statName.innerText = el.stat.name + ":";
    baseStat.innerText = el.base_stat;
    singleStat.append(statName, baseStat);
    stats.append(singleStat);
  });

  // divide by 10 because the creator of
  // pokeapi notes on github that the values are in decimeter
  let heightStatWrap = document.createElement("div");
  let heightP = document.createElement("p");
  let heightInCm = pokemon.height * 10;
  let heightStat = document.createElement("p");
  heightP.innerText = "HEIGHT:";
  heightStat.innerText = heightInCm + "cm";
  heightStatWrap.append(heightP, heightStat);

  // weight divide by 10 to go from hectogram to kilogram
  let widthStatWrap = document.createElement("div");
  let weightP = document.createElement("p");
  let weightInKg = pokemon.weight / 10;
  let weightStat = document.createElement("p");
  weightP = "WEIGHT:";
  weightStat.innerText = weightInKg + "kg";
  widthStatWrap.append(weightP, weightStat);
  stats.append(heightStatWrap, widthStatWrap);

  informationRow.append(basicInfo, typesAndAbilitiesWrap, statsWrap);

  let evolutionHeader = document.createElement("p");
  evolutionHeader.classList.add("infohead");
  evolutionHeader.innerText = "EVOLUTION";
  evolutionChainRow.append(evolutionHeader);
  speciesEvolution(pokemon.id);

  let nextDetailsBtn = document.createElement("button");
  nextDetailsBtn.innerText = "Next";
  nextDetailsBtn.addEventListener("click", (e) => NextDetails(pokemon.id));
  let prevDetailsBtn = document.createElement("button");
  prevDetailsBtn.addEventListener("click", (e) => PrevDetails(pokemon.id));
  prevDetailsBtn.innerText = "Previous";
  if (pokemon.id == 1) {
    navigationRow.append(nextDetailsBtn);
  } else {
    navigationRow.append(prevDetailsBtn, nextDetailsBtn);
  }

  document.body.append(detailWrap);
};

const NextDetails = async (id) => {
  let newId = id + 1;
  detailsPokemon(
    await singlePokemonCall(`https://pokeapi.co/api/v2/pokemon/${newId}`)
  );
};
const PrevDetails = async (id) => {
  if (id == 1) {
    return alert("Cannot go further back");
  } else {
    let newId = id - 1;
    detailsPokemon(
      await singlePokemonCall(`https://pokeapi.co/api/v2/pokemon/${newId}`)
    );
  }
};

const spriteShinyChange = (pokemon, spriteSRC, sprite) => {
  console.log(spriteSRC);
  console.log(sprite);

  if (spriteSRC.search("shiny") !== -1) {
    if (spriteSRC.search("back") !== -1) {
      sprite.src = pokemon.sprites.back_default;
    } else {
      sprite.src = pokemon.sprites.front_default;
    }
  } else {
    if (spriteSRC.search("back") !== -1) {
      sprite.src = pokemon.sprites.back_shiny;
    } else {
      sprite.src = pokemon.sprites.front_shiny;
    }
  }
};

const spriteDirectionChange = (pokemon, spriteSRC, sprite) => {
  if (spriteSRC.search("shiny") !== -1) {
    if (spriteSRC.search("back") !== -1) {
      sprite.src = pokemon.sprites.front_shiny;
    } else {
      sprite.src = pokemon.sprites.back_shiny;
    }
  } else {
    if (spriteSRC.search("back") !== -1) {
      sprite.src = pokemon.sprites.front_default;
    } else {
      sprite.src = pokemon.sprites.back_default;
    }
  }
};

// sprite = sprites.front_default
const speciesEvolution = async (id) => {
  try {
    let res = await fetch("https://pokeapi.co/api/v2/pokemon-species/" + id);
    let json = await res.json();

    evolutionCall(json.evolution_chain.url);
  } catch (err) {
    console.log(err);
  }
};

const evolutionCall = async (url) => {
  try {
    let res = await fetch(url);
    let json = await res.json();

    evolutionRender(json.chain);
  } catch (err) {
    console.log(err);
  }
};

const evolutionRender = async (evoChainProp) => {
  let evolutionArr = [];
  let evoRow = document.getElementById("evolutionChainRow");
  // if statements because I couldn't think of an algorithm to go through the
  if (Object.keys(evoChainProp.evolves_to[0].evolves_to).length !== 0) {
    evolutionArr.push(evoChainProp.species);
    evolutionArr.push(evoChainProp.evolves_to[0].species);
    evolutionArr.push(evoChainProp.evolves_to[0].evolves_to[0].species);
  } else {
    evolutionArr.push(evoChainProp.species);
    evolutionArr.push(evoChainProp.evolves_to[0].species);
  }

  let evolutionChain = document.createElement("div");
  evolutionChain.classList.add("evolutionChainWrapper");
  for (let i = 0; i < evolutionArr.length; i++) {
    let id = evolutionArr[i].url.split("/");
    id = id[id.length - 2];

    let singleEvolve = document.createElement("div");
    let evolveName = document.createElement("p");
    let evolveImg = document.createElement("img");

    singleEvolve.classList.add("single-evolve");
    evolveName.classList.add("evolve-name");
    evolveName.innerText = evolutionArr[i].name;
    evolveImg.classList.add("evolve-img");
    evolveImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

    singleEvolve.append(evolveName, evolveImg);
    if (i !== evolutionArr.length - 1) {
      let arrow = document.createElement("p");
      arrow.classList.add("arrow");
      arrow.innerText = ">";
      evolutionChain.append(singleEvolve, arrow);
    } else {
      evolutionChain.append(singleEvolve);
    }
  }
  evoRow.append(evolutionChain);
};

// Made some great progress!!
