const ESCAPE_MAP: Record<string, string> = {
  "&": "&" + "amp;",
  "<": "&" + "lt;",
  ">": "&" + "gt;",
  '"': "&" + "quot;",
  "'": "&" + "#039;",
};

export function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (ch) => ESCAPE_MAP[ch]);
}

export function escapeAttribute(value: unknown): string {
  return escapeHtml(value).replace(/`/g, "&" + "#096;");
}

export function errorMessage(error: unknown): string {
  if (!error) return "Une erreur inattendue est survenue.";
  const message = (error as { message?: string } | undefined)?.message ?? String(error);
  if (/invalid login credentials/i.test(message)) return "Email ou mot de passe incorrect.";
  return message;
}

export function formatDate(value: unknown): string {
  if (!value) return "date inconnue";
  const date = new Date(value as string | number | Date);
  if (Number.isNaN(date.getTime())) return "date inconnue";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
    .format(date)
    .replace(",", " à");
}

export function displayValue(value: unknown): string {
  return value === null || value === undefined || value === "" ? "-" : String(value);
}

export const SPELL_FIELDS = [
  "nom",
  "pa",
  "po",
  "porteeModifiable",
  "lancerEnLigne",
  "ligneDeVue",
  "cc",
  "ec",
  "relance",
  "parTour",
  "parCible",
  "effets.normaux",
  "effets.critiques",
];

export const CLASS_STAT_FIELDS = [
  "vie",
  "pa",
  "pm",
  "vitalite",
  "sagesse",
  "force",
  "intelligence",
  "chance",
  "agilite",
  "initiative",
];

export const FIELD_LABELS: Record<string, string> = {
  nom: "Nom",
  pa: "PA",
  po: "PO",
  porteeModifiable: "Portée modifiable",
  lancerEnLigne: "Lancer en ligne",
  ligneDeVue: "Ligne de vue",
  cc: "Coup critique",
  ec: "Échec critique",
  relance: "Relance",
  parTour: "Lancers par tour",
  parCible: "Lancers par cible",
  "effets.normaux": "Effets normaux",
  "effets.critiques": "Effets critiques",
  vie: "PV",
  pm: "PM",
  vitalite: "Vitalité",
  sagesse: "Sagesse",
  force: "Force",
  intelligence: "Intelligence",
  chance: "Chance",
  agilite: "Agilité",
  initiative: "Initiative",
  __import__: "Import de données",
};

export function fieldLabel(field: string): string {
  return FIELD_LABELS[field] || field;
}

export function valueText(value: unknown): string {
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Oui" : "Non";
  if (Array.isArray(value)) return value.length ? value.join("\n") : "(aucun effet)";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}
