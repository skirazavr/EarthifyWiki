export default function Infobox() {
  return (
    <aside className="infobox">
      <div className="ibox-title">Earthify</div>
      <div className="img">
        <img src="/assets/images/title-logo.png" alt="Earthify" />
      </div>
      <table>
        <tbody>
          <tr><td>Latest Version</td><td><a href="/versions#1.1.11">1.1.11</a> (<a href="/versions/earthify-1.1.11.jar">.jar</a>) / <a href="https://modrinth.com/mod/earthify">Modrinth</a></td></tr>
          <tr><td>Author</td><td>Skirazavr</td></tr>
          <tr><td>Minecraft</td><td>26.2</td></tr>
          <tr><td>Loader</td><td><a href="https://neoforged.net/">NeoForge</a></td></tr>
          <tr><td>License</td><td><a href="/license">Earthify License</a></td></tr>
        </tbody>
      </table>
    </aside>
  );
}
