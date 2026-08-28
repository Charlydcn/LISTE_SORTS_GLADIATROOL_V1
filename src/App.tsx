import { useEffect, useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { useSessionStore } from "./lib/sessionStore";
import { useDataStore } from "./lib/dataStore";
import { errorMessage } from "./lib/utils";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { ClassPage } from "./components/ClassPage";
import { Modal } from "./components/Modal";
import { Toasts } from "./components/Toasts";
import { MutationClassPage, MutationsPage, TonicsPage } from "./components/TonicPages";
import { useTonicStore } from "./lib/tonicStore";
import { FloorBonusesPage } from "./components/FloorBonusesPage";

function AppShell() {
  const mode = useSessionStore((s) => s.mode);
  const status = useDataStore((s) => s.status);
  const loadError = useDataStore((s) => s.loadError);
  const collaborationWarning = useDataStore((s) => s.collaborationWarning);
  const [initError, setInitError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        await useSessionStore.getState().initialize();
      } catch (error) {
        setInitError(`Impossible de vérifier la session Supabase : ${errorMessage(error)}`);
        useSessionStore.setState({ mode: "login" });
        return;
      }
    })();
  }, []);

  useEffect(() => {
    if (mode === "admin" || mode === "guest") {
      void useDataStore.getState().initialize();
      void useTonicStore.getState().initialize();
    }
  }, [mode]);

  if (mode === "loading") {
    return (
      <>
        <Header />
        <div id="app">
          <p className="app-loading">Chargement…</p>
        </div>
        <Modal />
        <Toasts />
      </>
    );
  }

  if (mode === "login") {
    return (
      <>
        <Header />
        <Login initialMessage={initError} />
        <Modal />
        <Toasts />
      </>
    );
  }

  if (status === "error") {
    return (
      <>
        <Header />
        <div id="app">
          <div className="error-box" role="alert">
            {loadError || "Impossible de charger les données de l’application."}
          </div>
          <button
            type="button"
            className="primary-button"
            onClick={() => void useDataStore.getState().initialize()}
          >
            Réessayer
          </button>
        </div>
        <Modal />
        <Toasts />
      </>
    );
  }

  if (status !== "ready") {
    return (
      <>
        <Header />
        <div id="app">
          <p className="app-loading">Chargement des données…</p>
        </div>
        <Modal />
        <Toasts />
      </>
    );
  }

  return (
    <>
      <Header />
      <div id="app" aria-live="polite">
        {collaborationWarning ? (
          <div className="warning-banner" role="alert">
            {collaborationWarning}
          </div>
        ) : null}
        <Routes>
          <Route path="/" element={<Navigate to="/sorts" replace />} />
          <Route path="/sorts" element={<Home />} />
          <Route path="/classe/:classe" element={<ClassPage />} />
          <Route path="/sorts/classe/:classe" element={<ClassPage />} />
          <Route path="/sorts/classe/:classe/sort/:spellId" element={<ClassPage />} />
          <Route path="/toniques" element={<TonicsPage />} />
          <Route path="/mutations" element={<MutationsPage />} />
          <Route path="/mutations/:classe" element={<MutationClassPage />} />
          <Route path="/bonus-etage" element={<FloorBonusesPage />} />
        </Routes>
      </div>
      <Modal />
      <Toasts />
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  );
}
