import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pageContents } from "../content/pages";

const BASE = import.meta.env.BASE_URL;
const ITEM_PATH = `${BASE}assets/images/items/`;
const SLOT_SIZE = 48;

const layouts: Record<string, { width: number; slots: Record<string, [number, number]> }> = {
  crafting: {
    width: 384,
    slots: {
      i1: [21, 21], i2: [75, 21], i3: [129, 21],
      i4: [21, 75], i5: [75, 75], i6: [129, 75],
      i7: [21, 129], i8: [75, 129], i9: [129, 129],
      output: [303, 75]
    }
  },
  extractor: {
    width: 384,
    slots: { input: [75, 75], output: [250, 75] }
  }
};

const itemInfo: Record<string, { name: string; color: string }> = {
  mixture: { name: "Mixture", color: "#7391C8" },
  winter_flower: { name: "Winter Flower", color: "#FAE199" },
  rosewood_oil: { name: "Rosewood Oil", color: "#FAE199" },
  extractor: { name: "Extractor", color: "#FAE199" },
  nether_star: { name: "Nether Star", color: "#55FFFF" }
};

function routeFromHref(href: string) {
  try {
    return new URL(href, window.location.href);
  } catch {
    return null;
  }
}

function setupRecipes(root: HTMLElement) {
  const recipes = root.querySelectorAll<HTMLElement>(".recipe-image");
  const tooltip = document.getElementById("item-tooltip");

  const render = (recipe: HTMLElement) => {
    recipe.querySelectorAll(".recipe-slot").forEach(slot => slot.remove());
    const layout = layouts[recipe.dataset.type ?? "crafting"];
    if (!layout) return;
    const scale = recipe.clientWidth / layout.width;

    Object.entries(layout.slots).forEach(([key, position]) => {
      const item = recipe.dataset[key];
      if (!item) return;
      const slot = document.createElement("div");
      slot.className = "recipe-slot";
      slot.style.left = `${position[0] * scale}px`;
      slot.style.top = `${position[1] * scale}px`;
      slot.style.width = `${SLOT_SIZE * scale}px`;
      slot.style.height = `${SLOT_SIZE * scale}px`;
      slot.dataset.item = item;
      slot.style.backgroundImage = `url("${ITEM_PATH}${item}.svg")`;
      recipe.appendChild(slot);
    });
  };

  const renderAll = () => recipes.forEach(render);
  renderAll();
  window.addEventListener("resize", renderAll);

  const hideTooltip = () => {
    if (!tooltip) return;
    tooltip.style.display = "none";
    tooltip.style.color = "#eaecf0";
  };

  const onMouseMove = (event: MouseEvent) => {
    if (!tooltip || tooltip.style.display !== "flex") return;
    const offset = 16;
    let x = event.clientX + offset;
    let y = event.clientY + offset;
    if (x + tooltip.offsetWidth > window.innerWidth - 8) x = event.clientX - tooltip.offsetWidth - offset;
    if (y + tooltip.offsetHeight > window.innerHeight - 8) y = event.clientY - tooltip.offsetHeight - offset;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };

  const onMouseOver = (event: MouseEvent) => {
    const target = event.target as Element | null;
    const slot = target?.closest<HTMLElement>(".recipe-slot");
    if (!slot || !tooltip) return;
    const id = slot.dataset.item ?? "";
    const info = itemInfo[id];
    tooltip.textContent = info?.name ?? id.replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());
    tooltip.style.color = info?.color ?? "#eaecf0";
    tooltip.style.display = "flex";
  };

  root.addEventListener("mouseover", onMouseOver);
  root.addEventListener("mouseout", event => {
    const target = event.target as Element | null;
    if (target?.closest(".recipe-slot")) hideTooltip();
  });
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("touchmove", hideTooltip, { passive: true });

  return () => {
    window.removeEventListener("resize", renderAll);
    root.removeEventListener("mouseover", onMouseOver);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("touchmove", hideTooltip);
    hideTooltip();
  };
}

function setupEntities(root: HTMLElement) {
  const previews = root.querySelectorAll<HTMLElement>(".entity-preview");
  const cleanups: Array<() => void> = [];

  previews.forEach(preview => {
    const image = preview.querySelector<HTMLImageElement>(".entity-image");
    if (!image) return;
    const entity = preview.dataset.entity;
    if (!entity) return;

    let age = preview.querySelector<HTMLElement>("[data-age].active")?.dataset.age ?? "adult";
    let variant = preview.querySelector<HTMLElement>("[data-variant].active")?.dataset.variant ?? null;

    const update = () => {
      const filename = variant ? `${entity}_${variant}_${age}.png` : `${entity}_${age}.png`;
      image.src = `${BASE}assets/images/mobs/${filename}`;
      const ageName = age === "adult" ? "Adult" : "Baby";
      image.alt = variant
        ? `${variant.charAt(0).toUpperCase()}${variant.slice(1)} ${entity} (${ageName})`
        : `${ageName} ${entity}`;
    };

    const onClick = (event: Event) => {
      const target = event.target as HTMLElement;
      const ageButton = target.closest<HTMLElement>("[data-age]");
      const variantButton = target.closest<HTMLElement>("[data-variant]");

      if (ageButton) {
        age = ageButton.dataset.age ?? age;
        preview.querySelectorAll("[data-age]").forEach(button => button.classList.toggle("active", button === ageButton));
        update();
      }

      if (variantButton) {
        variant = variantButton.dataset.variant ?? null;
        preview.querySelectorAll("[data-variant]").forEach(button => button.classList.toggle("active", button === variantButton));
        update();
      }
    };

    preview.addEventListener("click", onClick);
    update();
    cleanups.push(() => preview.removeEventListener("click", onClick));
  });

  return () => cleanups.forEach(cleanup => cleanup());
}

function setupCopy(root: HTMLElement) {
  const buttons = root.querySelectorAll<HTMLButtonElement>(".copy-btn");
  const handlers: Array<[HTMLButtonElement, () => void]> = [];

  buttons.forEach(button => {
    const handler = async () => {
      const code = button.closest(".code-block")?.querySelector("code")?.textContent ?? "";
      try {
        await navigator.clipboard.writeText(code);
        button.classList.add("copied");
        button.textContent = "Copied!";
        window.setTimeout(() => {
          button.classList.remove("copied");
          button.textContent = "Copy";
        }, 2000);
      } catch {
        button.textContent = "Copy failed";
      }
    };
    button.addEventListener("click", handler);
    handlers.push([button, handler]);
  });

  return () => handlers.forEach(([button, handler]) => button.removeEventListener("click", handler));
}

function setupPreview(root: HTMLElement) {
  if (window.innerWidth <= 768) return () => undefined;

  const preview = document.createElement("div");
  preview.className = "wiki-preview";
  preview.style.display = "none";
  document.body.appendChild(preview);

  const cache = new Map<string, { title: string; image: string | null; description: string; pageType: string }>();
  const handlers: Array<[Element, string, EventListener]> = [];
  let current: HTMLElement | null = null;

  const render = (data: { title: string; image: string | null; description: string; pageType: string }) => {
    preview.innerHTML = `
      <div class="preview-layout">
        <div class="preview-text">
          <div class="preview-title">${data.title}</div>
          <div class="preview-description">${data.description}</div>
        </div>
        ${data.image ? `<div class="preview-image ${data.pageType}"><img src="${data.image}" alt="${data.title}"></div>` : ""}
      </div>`;
    preview.style.display = "block";
  };

  const hide = () => {
    preview.style.display = "none";
    current = null;
  };

  root.querySelectorAll<HTMLElement>(".card, .main a").forEach(card => {
    const onEnter: EventListener = async () => {
      const href = card.getAttribute("href");
      const url = href ? routeFromHref(href) : null;
      if (!url || url.origin !== window.location.origin || !url.pathname.startsWith("/")) return;
      const base = import.meta.env.BASE_URL;
      const path = (url.pathname.startsWith(base)
        ? `/${url.pathname.slice(base.length).replace(/^\/+/, "")}`
        : url.pathname).replace(/\/$/, "") || "/";
      const page = pageContents.find(item => item.path === path);
      if (!page) return;
      current = card;
      if (cache.has(path)) {
        render(cache.get(path)!);
        return;
      }
      const doc = new DOMParser().parseFromString(page.source, "text/html");
      const title = doc.querySelector("h1")?.textContent?.trim() || card.textContent?.trim() || "Unknown";
      const imgElement = doc.querySelector(".img img, .infobox .img img, .infobox img") as HTMLImageElement | null;
      const image = imgElement?.getAttribute("src") ? new URL(`${BASE}${imgElement.getAttribute("src")!.replace(/^\//, "")}`, window.location.origin).href : null;
      let description = doc.querySelector(".text p, main p, p")?.textContent?.trim() || "No description available.";
      if (description.length > 180) description = `${description.substring(0, 180)}...`;
      const pageType = path.includes("/biomes/") ? "biome" : path.includes("/structures/") ? "structure" : path.includes("/items/") ? "item" : path.includes("/blocks/") ? "block" : "mob";
      const data = { title, image, description, pageType };
      cache.set(path, data);
      if (current === card) render(data);
    };

    const onMove: EventListener = event => {
      const e = event as MouseEvent;
      if (preview.style.display === "none") return;
      const gap = 20;
      const rect = preview.getBoundingClientRect();
      const cursorX = e.pageX;
      const cursorY = e.pageY;
      const viewportLeft = window.scrollX;
      const viewportRight = window.scrollX + window.innerWidth;
      const viewportBottom = window.scrollY + window.innerHeight;
      const spaceRight = viewportRight - cursorX;
      const spaceLeft = cursorX - viewportLeft;
      let x = spaceRight >= rect.width + gap ? cursorX + gap : spaceLeft >= rect.width + gap ? cursorX - rect.width - gap : Math.max(viewportLeft + gap, viewportRight - rect.width - gap);
      let y = cursorY + gap;
      if (y + rect.height > viewportBottom - gap) y = cursorY - rect.height - gap;
      if (y < window.scrollY + gap) y = window.scrollY + gap;
      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
    };

    const onLeave: EventListener = hide;
    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mousemove", onMove);
    card.addEventListener("mouseleave", onLeave);
    handlers.push([card, "mouseenter", onEnter], [card, "mousemove", onMove], [card, "mouseleave", onLeave]);
  });

  return () => {
    handlers.forEach(([element, type, handler]) => element.removeEventListener(type, handler));
    preview.remove();
  };
}

export default function SiteEffects() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    if (location.hash) {
      requestAnimationFrame(() => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView());
    }

    const root = document.querySelector<HTMLElement>(".main");
    if (!root) return;

    const cleanups: Array<() => void> = [];
    const recipeCleanup = setupRecipes(root);
    const entityCleanup = setupEntities(root);
    const copyCleanup = setupCopy(root);
    const previewCleanup = setupPreview(root);
    cleanups.push(recipeCleanup, entityCleanup, copyCleanup, previewCleanup);

    const clickHandler = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target as HTMLElement;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
      const url = routeFromHref(href);
      if (!url || url.origin !== window.location.origin) return;
      if (url.pathname.endsWith(".jar") || url.pathname.includes("/assets/")) return;
      event.preventDefault();
      const base = import.meta.env.BASE_URL;
      const pathname = url.pathname.startsWith(base)
        ? `/${url.pathname.slice(base.length).replace(/^\/+/, "")}`
        : url.pathname;
      navigate(`${pathname}${url.search}${url.hash}`);
    };

    document.addEventListener("click", clickHandler);
    cleanups.push(() => document.removeEventListener("click", clickHandler));

    return () => cleanups.forEach(cleanup => cleanup());
  }, [location.pathname, location.hash, navigate]);

  return null;
}
