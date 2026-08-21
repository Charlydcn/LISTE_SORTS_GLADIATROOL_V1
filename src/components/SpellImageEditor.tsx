import { useRef, useState, type ChangeEvent } from "react";
import type { Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { removeStoredSpellImages, uploadSpellImage } from "../lib/spellImageService";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";
import { SpellIcon } from "./icons";

export function SpellImageEditor({ spell }: { spell: Spell }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setBusy(true);
    let uploadedUrl: string | null = null;
    try {
      const uploaded = await uploadSpellImage(spell.id, file);
      uploadedUrl = uploaded.url;
      await useDataStore.getState().save("spell", String(spell.id), "icone", uploaded.url);
      try {
        await removeStoredSpellImages([spell.icone]);
      } catch (cleanupError) {
        console.error("Impossible de supprimer l’ancienne icône :", cleanupError);
      }
      useToastStore.getState().showToast("Image du sort remplacée.", "success");
    } catch (error) {
      if (uploadedUrl) {
        try {
          await removeStoredSpellImages([uploadedUrl]);
        } catch (cleanupError) {
          console.error("Impossible de nettoyer la nouvelle icône :", cleanupError);
        }
      }
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="spell-image-editor">
      <SpellIcon spell={spell} />
      <input
        ref={inputRef}
        className="spell-image-input"
        type="file"
        accept=".svg,.png,.jpg,.jpeg,.webp,image/svg+xml,image/png,image/jpeg,image/webp"
        onChange={(event) => void handleFile(event)}
        disabled={busy}
        aria-label={`Choisir une nouvelle image pour ${spell.nom}`}
      />
      <button
        type="button"
        className="spell-image-button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        aria-label={`Remplacer l’image de ${spell.nom}`}
        title="Remplacer l’image (SVG, PNG, JPEG ou WebP, 2 Mo maximum)"
      >
        {busy ? "…" : "Modifier"}
      </button>
    </div>
  );
}
