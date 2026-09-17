import type { WeaponType } from "../types";

function normalized(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("fr");
}

export function weaponNameForType(name: string, currentType: WeaponType, nextType: WeaponType): string {
  if (!name || currentType === nextType) return name;
  const currentPrefix = name.slice(0, currentType.length);
  if (normalized(currentPrefix) !== normalized(currentType)) return name;
  return `${nextType}${name.slice(currentType.length)}`;
}
