import Search from "./Search";

export default function Header() {
  return (
    <header className="header">
      <div className="brand">
        <a href="/" aria-label="Earthify Wiki" />
      </div>
      <Search />
    </header>
  );
}
