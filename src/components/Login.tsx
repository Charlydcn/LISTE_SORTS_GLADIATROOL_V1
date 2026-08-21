import { useState, type FormEvent } from "react";
import { useSessionStore } from "../lib/sessionStore";
import { errorMessage } from "../lib/utils";
import { DefaultIcon } from "./icons";

export function Login({ initialMessage = "" }: { initialMessage?: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(initialMessage);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      await useSessionStore.getState().signIn(email.trim(), password);
    } catch (error) {
      setMessage(errorMessage(error));
      setBusy(false);
    }
  }

  function enterGuest() {
    useSessionStore.getState().enterGuest();
  }

  return (
    <main className="login-shell">
      <section className="login-card" aria-labelledby="login-title">
        <div className="login-emblem">
          <DefaultIcon />
        </div>
        <h1 id="login-title">Accès Gladiatrool</h1>
        <p>Connectez-vous pour administrer les sorts.</p>
        {message ? (
          <div className="error-box" role="alert">
            {message}
          </div>
        ) : null}
        <form onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label htmlFor="login-password">Mot de passe</label>
          <input
            id="login-password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button type="submit" className="primary-button" disabled={busy}>
            {busy ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <button type="button" className="guest-link" onClick={enterGuest}>
          Consulter en tant qu’invité
        </button>
      </section>
    </main>
  );
}
