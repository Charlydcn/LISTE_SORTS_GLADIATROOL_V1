import { supabase } from "./supabase";

export const SPELL_IMAGE_BUCKET = "spell-images";
export const MAX_SPELL_IMAGE_BYTES = 2 * 1024 * 1024;

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
};

function extensionFor(file: File): string | null {
  const byType = ALLOWED_TYPES[file.type.toLowerCase()];
  if (byType) return byType;
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension === "jpg" || extension === "jpeg") return "jpg";
  return extension && ["png", "webp", "svg"].includes(extension) ? extension : null;
}

function waitForImage(url: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const timeout = window.setTimeout(
      () => reject(new Error("Le chargement de l’image a expiré.")),
      10000,
    );
    image.onload = () => {
      window.clearTimeout(timeout);
      resolve();
    };
    image.onerror = () => {
      window.clearTimeout(timeout);
      reject(new Error("Le fichier ne peut pas être affiché comme une image."));
    };
    image.src = url;
  });
}

export async function validateSpellImage(file: File): Promise<string> {
  const extension = extensionFor(file);
  if (!extension) {
    throw new Error("Format refusé. Utilisez une image SVG, PNG, JPEG ou WebP.");
  }
  if (file.size === 0) throw new Error("Le fichier image est vide.");
  if (file.size > MAX_SPELL_IMAGE_BYTES) {
    throw new Error("L’image dépasse la taille maximale de 2 Mo.");
  }

  if (extension === "svg") {
    const document = new DOMParser().parseFromString(await file.text(), "image/svg+xml");
    if (document.querySelector("parsererror") || document.documentElement.localName !== "svg") {
      throw new Error("Le fichier SVG est invalide.");
    }
    return extension;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    await waitForImage(objectUrl);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
  return extension;
}

export interface UploadedSpellImage {
  path: string;
  url: string;
}

export async function uploadSpellImage(spellId: number, file: File): Promise<UploadedSpellImage> {
  if (!supabase) throw new Error("Supabase JS n'a pas pu être chargé.");
  const extension = await validateSpellImage(file);
  const path = `${spellId}/${crypto.randomUUID()}.${extension}`;
  const storage = supabase.storage.from(SPELL_IMAGE_BUCKET);
  const { error } = await storage.upload(path, file, {
    cacheControl: "3600",
    contentType: extension === "jpg" ? "image/jpeg" : extension === "svg" ? "image/svg+xml" : `image/${extension}`,
    upsert: false,
  });
  if (error) throw error;

  const { data } = storage.getPublicUrl(path);
  if (!data.publicUrl) {
    await storage.remove([path]);
    throw new Error("Supabase n'a retourné aucune URL pour l’image.");
  }

  try {
    await waitForImage(data.publicUrl);
  } catch (error) {
    await storage.remove([path]);
    throw error;
  }
  return { path, url: data.publicUrl };
}

export function storedSpellImagePath(url: unknown): string | null {
  if (typeof url !== "string") return null;
  const marker = `/storage/v1/object/public/${SPELL_IMAGE_BUCKET}/`;
  try {
    const parsed = new URL(url);
    const index = parsed.pathname.indexOf(marker);
    if (index < 0) return null;
    const path = decodeURIComponent(parsed.pathname.slice(index + marker.length));
    return path && !path.includes("..") ? path : null;
  } catch {
    return null;
  }
}

export async function removeStoredSpellImages(urls: unknown[]): Promise<void> {
  if (!supabase) throw new Error("Supabase JS n'a pas pu être chargé.");
  const paths = [...new Set(urls.map(storedSpellImagePath).filter((path): path is string => Boolean(path)))];
  if (!paths.length) return;
  const { error } = await supabase.storage.from(SPELL_IMAGE_BUCKET).remove(paths);
  if (error) throw error;
}
