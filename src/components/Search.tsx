import { useEffect, useRef, useState } from "react";
import { searchPages } from "../data/searchPages";

const BASE = import.meta.env.BASE_URL;

export default function Search() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const normalized = query.trim().toLowerCase();

  const found = normalized
      ? searchPages.filter(page =>
          page.title.toLowerCase().includes(normalized)
      )
      : [];

  const updateFade = () => {
    const results = resultsRef.current;

    if (!results) {
      return;
    }

    const maxScroll =
        results.scrollHeight - results.clientHeight;

    results.classList.toggle(
        "fade-top",
        results.scrollTop > 0
    );

    results.classList.toggle(
        "fade-bottom",
        results.scrollTop < maxScroll - 1
    );
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationFrame(updateFade);
  }, [open, found.length]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
          searchRef.current &&
          !searchRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const getPageUrl = (url: string) => {
    return `${BASE}${url}`.replace(/\/+/g, "/");
  };

  const getAssetUrl = (url: string) => {
    return `${BASE}${url.replace(/^\/+/, "")}`.replace(
        /\/+/g,
        "/"
    );
  };

  return (
      <div
          ref={searchRef}
          className="search-container"
      >
        <label>
          <input
              type="search"
              className="search-input"
              placeholder="Search"
              value={query}
              onChange={event => {
                const value = event.target.value;

                setQuery(value);
                setOpen(value.trim().length > 0);
              }}
              onFocus={() => {
                if (query.trim()) {
                  setOpen(true);
                }
              }}
              onKeyDown={event => {
                if (event.key === "Escape") {
                  setQuery("");
                  setOpen(false);
                }
              }}
          />
        </label>

        {open && (
            <div
                ref={resultsRef}
                className="search-results"
                style={{ display: "block" }}
                onScroll={updateFade}
            >
              {found.length === 0 ? (
                  <div className="search-item">
                    Nothing found
                  </div>
              ) : (
                  found.map(page => {
                    const rarity =
                        page.rarity ?? "common";

                    return (
                        <a
                            key={page.url}
                            href={getPageUrl(page.url)}
                            className="search-item"
                            onClick={() => {
                              setOpen(false);
                              setQuery("");
                            }}
                        >
                          <div className="search-item-content">
                            <div className="search-item-text">
                              <strong
                                  className={`rarity-${rarity}`}
                              >
                                {page.title}
                              </strong>

                              <br />

                              <small>
                                {page.category}
                              </small>
                            </div>

                            {page.icon && (
                                <img
                                    className="search-item-icon"
                                    src={getAssetUrl(
                                        page.icon
                                    )}
                                    alt={page.title}
                                />
                            )}
                          </div>
                        </a>
                    );
                  })
              )}
            </div>
        )}
      </div>
  );
}