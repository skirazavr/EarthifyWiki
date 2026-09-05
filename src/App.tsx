import { BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BackToTop from "./components/BackToTop";
import Season from "./components/Season";
import SiteEffects from "./components/SiteEffects";
import WikiPage from "./pages/WikiPage";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Season />
      <Header />
      <div className="wrapper">
        <Sidebar />
        <main className="main">
          <WikiPage />
        </main>
      </div>
      <BackToTop />
      <div id="item-tooltip" />
      <SiteEffects />
    </BrowserRouter>
  );
}
