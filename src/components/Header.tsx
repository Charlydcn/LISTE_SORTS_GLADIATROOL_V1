import { NavLink, useLocation } from "react-router-dom";
import { useSessionStore } from "../lib/sessionStore";
import { useModalStore } from "../lib/modalStore";
import { useHistoryStore } from "../lib/historyStore";
import { useToastStore } from "../lib/toastStore";
import { CLASSES } from "../lib/dataService";
import { errorMessage } from "../lib/utils";
import { HistoryModal } from "./HistoryModal";
import { HistoryIcon, LoginIcon, LogoutIcon } from "./icons";
import { ExportGlobalButton, ImportButton } from "./SpellTransferActions";

function currentClassFilter(pathname: string): string {
  const match = pathname.match(/^\/(?:sorts\/classe|classe|mutations)\/(.+)$/);
  if (match) {
    const className = decodeURIComponent(match[1]);
    if (CLASSES.includes(className)) return className;
  }
  return "";
}

export function Header() {
  const mode = useSessionStore((s) => s.mode);
  const user = useSessionStore((s) => s.user);
  const location = useLocation();

  if (mode === "login" || mode === "loading") {
    return <header id="app-header" />;
  }

  const isAdmin = mode === "admin";

  function openGlobalHistory() {
    const classFilter = currentClassFilter(location.pathname);
    useHistoryStore.getState().open(null, { classFilter });
    useModalStore.getState().open("Historique global", <HistoryModal />, { wide: true });
  }

  async function leave() {
    try {
      await useSessionStore.getState().leave();
    } catch (error) {
      useToastStore.getState().showToast(errorMessage(error), "error");
    }
  }

  return (
    <header id="app-header">
      <nav className="main-navigation" aria-label="Navigation principale">
        <a className="site-title" href="#/sorts">Gladiatrool</a>
        <div className="navigation-links">
          <NavLink to="/sorts">Sorts</NavLink>
          <NavLink to="/toniques">Toniques</NavLink>
          <NavLink to="/mutations">Mutations</NavLink>
          <NavLink to="/bonus-etage">Bonus d’étage</NavLink>
          <NavLink to="/monstres">Monstres</NavLink>
        </div>
      </nav>
      <nav className="app-toolbar" aria-label="Actions de session">
        {isAdmin ? (
          <span className="session-identity">{user?.email || "Administrateur"}</span>
        ) : (
          <span className="session-identity guest">Mode invité</span>
        )}
        {isAdmin ? <ExportGlobalButton /> : null}
        {isAdmin ? <ImportButton /> : null}
        <button type="button" className="toolbar-button toolbar-icon-button" aria-label="Ouvrir l’historique" title="Ouvrir l’historique" onClick={openGlobalHistory}>
          <HistoryIcon />
        </button>
        <button type="button" className="toolbar-button toolbar-icon-button" aria-label={isAdmin ? "Se déconnecter" : "Se connecter"} title={isAdmin ? "Se déconnecter" : "Se connecter"} onClick={() => void leave()}>
          {isAdmin ? <LogoutIcon /> : <LoginIcon />}
        </button>
      </nav>
    </header>
  );
}
