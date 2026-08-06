const pages = [
    { title: "Fancy Chicken", url: "mobs/fancy_chicken", category: "Mob", icon: "assets/images/spawn_eggs/fancy_chicken.svg" },
    { title: "Cluckshroom", url: "mobs/cluckshroom", category: "Mob", icon: "assets/images/spawn_eggs/cluckshroom.svg" },
    { title: "Badger", url: "mobs/badger", category: "Mob", icon: "assets/images/spawn_eggs/badger.svg" },
    { title: "Penguin", url: "mobs/penguin", category: "Mob", icon: "assets/images/spawn_eggs/penguin.svg" },
    { title: "Raccoon", url: "mobs/raccoon", category: "Mob", icon: "assets/images/spawn_eggs/raccoon.svg" },
    { title: "Jolly Llama", url: "mobs/jolly_llama", category: "Mob", icon: "assets/images/spawn_eggs/jolly_llama.svg" },
    { title: "Duck", url: "mobs/duck", category: "Mob", icon: "assets/images/spawn_eggs/duck.svg" },
    { title: "Dyed Cat", url: "mobs/dyed_cat", category: "Mob", icon: "assets/images/spawn_eggs/dyed_cat.svg" },
    { title: "Horned Sheep", url: "mobs/horned_sheep", category: "Mob", icon: "assets/images/spawn_eggs/horned_sheep.svg" },
    { title: "Jumbo Rabbit", url: "mobs/jumbo_rabbit", category: "Mob", icon: "assets/images/spawn_eggs/jumbo_rabbit.svg" },
    { title: "Wooly Cow", url: "mobs/wooly_cow", category: "Mob", icon: "assets/images/spawn_eggs/wooly_cow.svg" },
    { title: "Umbra Cow", url: "mobs/umbra_cow", category: "Mob", icon: "assets/images/spawn_eggs/umbra_cow.svg" },
    { title: "Magma Cow", url: "mobs/magma_cow", category: "Mob", icon: "assets/images/spawn_eggs/magma_cow.svg" },
    { title: "Moobloom", url: "mobs/moobloom", category: "Mob", icon: "assets/images/spawn_eggs/moobloom.svg" },
    { title: "Moolip", url: "mobs/moolip", category: "Mob", icon: "assets/images/spawn_eggs/moolip.svg" },
    { title: "Capybara", url: "mobs/capybara", category: "Mob", icon: "assets/images/spawn_eggs/capybara.svg" },
    { title: "Skeleton Wolf", url: "mobs/skeleton_wolf", category: "Mob", icon: "assets/images/spawn_eggs/skeleton_wolf.svg" },
    { title: "Zombified Rabbit", url: "mobs/zombified_rabbit", category: "Mob", icon: "assets/images/spawn_eggs/zombified_rabbit.svg" },
    { title: "Bone Spider", url: "mobs/bone_spider", category: "Mob", icon: "assets/images/spawn_eggs/bone_spider.svg" },
    { title: "Viler Witch", url: "mobs/viler_witch", category: "Mob", icon: "assets/images/spawn_eggs/viler_witch.svg" },
    { title: "Bouldering Zombie", url: "mobs/bouldering_zombie", category: "Mob", icon: "assets/images/spawn_eggs/bouldering_zombie.svg" },
    { title: "Lobber Zombie", url: "mobs/lobber_zombie", category: "Mob", icon: "assets/images/spawn_eggs/lobber_zombie.svg" },
    { title: "Furnace Golem", url: "mobs/furnace_golem", category: "Mob", icon: "assets/images/spawn_eggs/furnace_golem.svg" },
    { title: "Rosewood Grove", url: "biomes/rosewood_grove", category: "Biome" },
    { title: "Small Stable", url: "structures/small_stable", category: "Structure" },
    { title: "Mixture", url: "items/mixture", category: "Item", icon: "assets/items/mixture.png" },
    { title: "Extractor", url: "blocks/extractor", category: "Block", icon: "assets/images/blocks/extractor.svg" }
];

const ROOT = location.pathname.startsWith("/EarthifyWiki/")
    ? "/EarthifyWiki/"
    : "/";

const input = document.querySelector(".search-input");

const results = document.createElement("div");
results.className = "search-results";
document.querySelector(".search-container").appendChild(results);

function updateFade() {
    const maxScroll = results.scrollHeight - results.clientHeight;

    results.classList.toggle("fade-top", results.scrollTop > 0);
    results.classList.toggle("fade-bottom", results.scrollTop < maxScroll - 1);
}

results.addEventListener("scroll", updateFade);

input.addEventListener("input", () => {

    const query = input.value.trim().toLowerCase();

    results.innerHTML = "";

    if (query.length === 0) {
        results.classList.remove("fade-top", "fade-bottom");
        results.style.display = "none";
        return;
    }

    const found = pages.filter(page =>
        page.title.toLowerCase().includes(query)
    );

    if (found.length === 0) {
        results.innerHTML = "<div class='search-item'>Nothing found</div>";
    } else {
        found.forEach(page => {
            const a = document.createElement("a");

            a.href = ROOT + page.url;
            a.className = "search-item";
            a.innerHTML = `
    <div class="search-item-content">
        <div class="search-item-text">
            <strong>${page.title}</strong><br>
            <small>${page.category}</small>
        </div>
        ${page.icon ? `<img class="search-item-icon" src="${ROOT + page.icon}" alt="${page.title}">` : ""}
    </div>
`;
            results.appendChild(a);
        });
    }

    results.style.display = "block";
    requestAnimationFrame(updateFade);
});

document.addEventListener("click", e => {
    if (!e.target.closest(".search-container")) {
        results.style.display = "none";
    }
});