import { useEffect, useRef, useState } from "react";
import { useDataStore } from "../lib/dataStore";
import { useSessionStore } from "../lib/sessionStore";
import { useModalStore } from "../lib/modalStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage, fieldLabel } from "../lib/utils";
import { HistoryIcon } from "./icons";
import { HistoryModal } from "./HistoryModal";
import { useHistoryStore } from "../lib/historyStore";

export type InputType = "text" | "number" | "nullable-number" | "boolean" | "textarea";

type ControlElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function parseEditorValue(control: ControlElement, type: InputType): unknown {
  const value = control.value;
  if (type === "boolean") return value === "true";
  if (type === "textarea") {
    return value.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  }
  if (type === "number" || type === "nullable-number") {
    if (type === "nullable-number" && value.trim() === "") return null;
    const number = Number(value);
    if (!Number.isFinite(number)) throw new Error("Saisissez un nombre valide.");
    return number;
  }
  return value.trim();
}

interface InlineEditorProps {
  entityType: string;
  entityKey: string | number;
  fieldKey: string;
  inputType: InputType;
  onClose: () => void;
}

export function InlineEditor({ entityType, entityKey, fieldKey, inputType, onClose }: InlineEditorProps) {
  const [status, setStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [saving, setSaving] = useState(false);
  const controlRef = useRef<ControlElement | null>(null);
  const initial = useRef(
    useDataStore.getState().getEffectiveValue(entityType, String(entityKey), fieldKey),
  ).current;

  useEffect(() => {
    controlRef.current?.focus();
  }, []);

  async function doSave() {
    const control = controlRef.current;
    if (!control) return;
    try {
      const value = parseEditorValue(control, inputType);
      setSaving(true);
      setStatus("Enregistrement…");
      const result = await useDataStore
        .getState()
        .save(entityType, String(entityKey), fieldKey, value);
      useToastStore
        .getState()
        .showToast(result.changed ? "Modification enregistrée." : "Valeur inchangée.", "success");
      onClose();
    } catch (error) {
      setSaving(false);
      setStatus(errorMessage(error));
      setIsError(true);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLSpanElement>) {
    const target = event.target as HTMLElement;
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "Enter" && target.tagName !== "TEXTAREA") {
      event.preventDefault();
      void doSave();
      return;
    }
    if (event.key === "Enter" && target.tagName === "TEXTAREA" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      void doSave();
    }
  }

  let control: React.ReactNode;
  if (inputType === "boolean") {
    control = (
      <select
        className="inline-input"
        aria-label="Nouvelle valeur"
        ref={(el) => {
          controlRef.current = el;
        }}
        defaultValue={initial === true ? "true" : "false"}
      >
        <option value="true">Oui</option>
        <option value="false">Non</option>
      </select>
    );
  } else if (inputType === "textarea") {
    control = (
      <textarea
        className="inline-input"
        rows={7}
        aria-label="Nouvelle valeur"
        ref={(el) => {
          controlRef.current = el;
        }}
        defaultValue={((initial as string[] | undefined) || []).join("\n")}
      />
    );
  } else {
    const type = inputType.includes("number") ? "number" : "text";
    control = (
      <input
        className="inline-input"
        type={type}
        aria-label="Nouvelle valeur"
        ref={(el) => {
          controlRef.current = el;
        }}
        defaultValue={initial === null || initial === undefined ? "" : String(initial)}
        required={inputType === "number"}
      />
    );
  }

  return (
    <span
      className="inline-editor"
      data-entity-type={entityType}
      data-entity-key={String(entityKey)}
      data-field-key={fieldKey}
      data-input-type={inputType}
      onKeyDown={handleKeyDown}
    >
      {control}
      <span className="editor-actions">
        <button type="button" className="save-edit" disabled={saving} onClick={() => void doSave()}>
          Enregistrer
        </button>
        <button type="button" className="cancel-edit" disabled={saving} onClick={onClose}>
          Annuler
        </button>
      </span>
      <span className={`save-status${isError ? " save-error" : ""}`} aria-live="polite">
        {status}
      </span>
    </span>
  );
}

interface EditableFieldProps {
  entityType: string;
  entityKey: string | number;
  fieldKey: string;
  inputType: InputType;
  children: React.ReactNode;
  extraClass?: string;
}

export function EditableField({
  entityType,
  entityKey,
  fieldKey,
  inputType,
  children,
  extraClass = "",
}: EditableFieldProps) {
  const isAdmin = useSessionStore((s) => s.mode) === "admin";
  const override = useDataStore((s) => s.getOverride(entityType, String(entityKey), fieldKey));
  const [editing, setEditing] = useState(false);
  const openModal = useModalStore((s) => s.open);

  const changedClass = override ? "is-overridden" : "";

  function openHistory() {
    useHistoryStore
      .getState()
      .open({ entityType, entityKey: String(entityKey), fieldKey });
    openModal(`Historique - ${fieldLabel(fieldKey)}`, <HistoryModal />, { wide: true });
  }

  if (editing) {
    return (
      <span className={`editable-field ${changedClass} ${extraClass}`}>
        <InlineEditor
          entityType={entityType}
          entityKey={entityKey}
          fieldKey={fieldKey}
          inputType={inputType}
          onClose={() => setEditing(false)}
        />
      </span>
    );
  }

  const trigger = isAdmin ? (
    <button type="button" className="editable-trigger" data-editable onClick={() => setEditing(true)}>
      {children}
    </button>
  ) : (
    <span className="field-value">{children}</span>
  );

  const history = override ? (
    <button
      type="button"
      className="field-history"
      aria-label={`Voir l'historique de ${fieldLabel(fieldKey)}`}
      onClick={openHistory}
    >
      <HistoryIcon />
    </button>
  ) : null;

  return (
    <span className={`editable-field ${changedClass} ${extraClass}`}>
      {trigger}
      {history}
    </span>
  );
}

