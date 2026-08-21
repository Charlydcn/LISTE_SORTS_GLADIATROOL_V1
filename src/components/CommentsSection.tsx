import { useEffect, useState, type FormEvent } from "react";
import type { CommentRow } from "../types";
import { supabase } from "../lib/supabase";
import { useToastStore } from "../lib/toastStore";
import { errorMessage, formatDate } from "../lib/utils";
import { FragmentBr } from "./icons";
import { parseCommentRows } from "../lib/validation";

function CommentItem({
  comment,
  onUpdate,
  onRemove,
}: {
  comment: CommentRow;
  onUpdate: (id: string, body: string) => Promise<void>;
  onRemove: (id: string) => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [body, setBody] = useState(comment.body);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [removeBusy, setRemoveBusy] = useState(false);

  const edited =
    comment.updated_at &&
    new Date(comment.updated_at).getTime() > new Date(comment.created_at).getTime() + 1000;

  async function handleUpdate(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      await onUpdate(comment.id, body.trim());
      setEditing(false);
    } catch {
      // L'erreur est affichée par le parent.
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (confirming) {
      setConfirming(false);
      setRemoveBusy(true);
      try {
        await onRemove(comment.id);
      } catch {
        // L'erreur est affichée par le parent.
      } finally {
        setRemoveBusy(false);
      }
      return;
    }
    setConfirming(true);
    window.setTimeout(() => setConfirming(false), 4000);
  }

  return (
    <article className="comment">
      <div className="comment-head">
        <strong>{comment.created_by_label || "Auteur inconnu"}</strong>
        <div className="comment-actions">
          <button
            type="button"
            className="text-button"
            onClick={() => {
              setBody(comment.body);
              setEditing(true);
            }}
          >
            Modifier
          </button>
          <button
            type="button"
            className={`danger-link ${confirming ? "confirming" : ""}`}
            onClick={() => void handleDelete()}
            disabled={removeBusy}
          >
            {removeBusy ? "Suppression…" : confirming ? "Vraiment ?" : "Supprimer"}
          </button>
        </div>
      </div>
      <p className="comment-meta">
        Créé le {formatDate(comment.created_at)}
        {edited ? (
          <>
            <br />
            Modifié le {formatDate(comment.updated_at)}
            {comment.updated_by_label ? ` par ${comment.updated_by_label}` : ""}
          </>
        ) : null}
      </p>
      {editing ? (
        <form className="comment-edit-form" onSubmit={handleUpdate}>
          <label className="sr-only" htmlFor={`comment-edit-${comment.id}`}>
            Modifier le commentaire
          </label>
          <textarea
            id={`comment-edit-${comment.id}`}
            name="body"
            rows={4}
            required
            maxLength={10000}
            value={body}
            onChange={(event) => setBody(event.target.value)}
          />
          <div className="editor-actions">
            <button type="submit" className="primary-button" disabled={busy}>
              Enregistrer
            </button>
            <button type="button" className="secondary-button" onClick={() => setEditing(false)}>
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <p className="comment-body">
          <FragmentBr text={comment.body} />
        </p>
      )}
    </article>
  );
}

export function CommentsSection({ spellId }: { spellId: number | string }) {
  const id = String(spellId);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newBody, setNewBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function list() {
    if (!supabase) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("spell_comments")
      .select(
        "id,spell_id,body,created_at,updated_at,created_by_label,updated_by_label",
      )
      .eq("spell_id", id)
      .order("created_at", { ascending: false });
    if (err) {
      setError(errorMessage(err));
      setLoading(false);
      return;
    }
    try {
      setComments(parseCommentRows(data ?? [], "la table spell_comments"));
    } catch (validationError) {
      setError(errorMessage(validationError));
    }
    setLoading(false);
  }

  useEffect(() => {
    void list();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function create(event: FormEvent) {
    event.preventDefault();
    if (!supabase) return;
    const body = newBody.trim();
    if (!body) return;
    setSubmitting(true);
    const { error: err } = await supabase.from("spell_comments").insert({ spell_id: id, body });
    if (err) {
      useToastStore.getState().showToast(errorMessage(err), "error");
      setSubmitting(false);
      return;
    }
    setNewBody("");
    await list();
    setSubmitting(false);
    useToastStore.getState().showToast("Commentaire ajouté.", "success");
  }

  async function updateComment(commentId: string, body: string) {
    if (!supabase) return;
    if (!body) return;
    const { error: err } = await supabase.from("spell_comments").update({ body }).eq("id", commentId);
    if (err) {
      useToastStore.getState().showToast(errorMessage(err), "error");
      throw err;
    }
    await list();
    useToastStore.getState().showToast("Commentaire modifié.", "success");
  }

  async function removeComment(commentId: string) {
    if (!supabase) return;
    const { error: err } = await supabase.from("spell_comments").delete().eq("id", commentId);
    if (err) {
      useToastStore.getState().showToast(errorMessage(err), "error");
      throw err;
    }
    await list();
    useToastStore.getState().showToast("Commentaire supprimé.", "success");
  }

  return (
    <section className="comments-section">
      <h3>Commentaires</h3>
      {loading ? (
        <p className="loading-state">Chargement des commentaires…</p>
      ) : error ? (
        <p className="error-box">{error}</p>
      ) : (
        <>
          <form className="comment-form" onSubmit={create}>
            <label htmlFor={`new-comment-${id}`}>Ajouter un commentaire</label>
            <textarea
              id={`new-comment-${id}`}
              name="body"
              rows={3}
              required
              maxLength={10000}
              value={newBody}
              onChange={(event) => setNewBody(event.target.value)}
            />
            <button type="submit" className="primary-button" disabled={submitting}>
              Publier
            </button>
          </form>
          <div className="comment-list">
            {comments.length ? (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onUpdate={updateComment}
                  onRemove={removeComment}
                />
              ))
            ) : (
              <p className="empty-state">Aucun commentaire.</p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
