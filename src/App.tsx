import { useEffect, useState } from "react";
import { HashRouter, Route, Routes } from "react-router-dom";
import { useSessionStore } from "./lib/sessionStore";
import { useDataStore } from "./lib/dataStore";
import { errorMessage } from "./lib/utils";
import { Header } from "./components/Header";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { ClassPage } from "./components/ClassPage";
import { Modal } from "./components/Modal";
import { Toasts } from "./components/Toasts";

function AppShell() {
  const mode = useSessionStore((s) => s.mode);
  const status = useDataStore((s) => s.status);
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
      const currentMode = useSessionStore.getState().mode;
      if (currentMode === "admin" || currentMode === "guest") {
        await useDataStore.getState().initialize();
      }
    })();
  }, []);

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
          <Route path="/" element={<Home />} />
          <Route path="/classe/:classe" element={<ClassPage />} />
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
