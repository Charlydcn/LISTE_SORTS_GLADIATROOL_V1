/* Baseline + overrides = valeurs effectives. Toute écriture passe par la RPC atomique. */
(function createStore() {
  const overrideMap = new Map();

  function mapKey(entityType, entityKey, fieldKey) {
    return `${entityType}\u0000${entityKey}\u0000${fieldKey}`;
  }

  function effectLines(spell, tab) {
    return spell.effets.filter((effect) => effect.onglet === tab).map((effect) => effect.texte);
  }

  function assignSpellField(spell, fieldKey, value) {
    if (fieldKey === "effets.normaux" || fieldKey === "effets.critiques") {
      const tab = fieldKey.split(".")[1];
      const replacement = (Array.isArray(value) ? value : []).map((texte) => ({ onglet: tab, texte: String(texte) }));
      const other = spell.effets.filter((effect) => effect.onglet !== tab);
      spell.effets = tab === "normaux" ? [...replacement, ...other] : [...other, ...replacement];
      return;
    }
    spell[fieldKey] = value;
  }

  function setEffectiveValue(entityType, entityKey, fieldKey, value) {
    if (entityType === "spell") {
      [...SPELLS, ...COMMON_SPELLS]
        .filter((spell) => String(spell.id) === String(entityKey))
        .forEach((spell) => assignSpellField(spell, fieldKey, value));
      return;
    }
    if (entityType === "class_stat" && MORPH_STATS[entityKey]) {
      MORPH_STATS[entityKey][fieldKey] = value;
    }
  }

  function getSpellById(id) {
    return SPELLS.find((spell) => String(spell.id) === String(id))
      || COMMON_SPELLS.find((spell) => String(spell.id) === String(id));
  }

  function getBaselineValue(entityType, entityKey, fieldKey) {
    if (entityType === "spell") {
      const spell = window.AppData.getBaselineSpells().find((item) => String(item.id) === String(entityKey));
      if (!spell) return undefined;
      if (fieldKey === "effets.normaux") return effectLines(spell, "normaux");
      if (fieldKey === "effets.critiques") return effectLines(spell, "critiques");
      return window.AppData.cloneData(spell[fieldKey]);
    }
    return window.AppData.cloneData(BASE_MORPH_STATS[entityKey]?.[fieldKey]);
  }

  function getEffectiveValue(entityType, entityKey, fieldKey) {
    if (entityType === "spell") {
      const spell = getSpellById(entityKey);
      if (!spell) return undefined;
      if (fieldKey === "effets.normaux") return effectLines(spell, "normaux");
      if (fieldKey === "effets.critiques") return effectLines(spell, "critiques");
      return window.AppData.cloneData(spell[fieldKey]);
    }
    return window.AppData.cloneData(MORPH_STATS[entityKey]?.[fieldKey]);
  }

  function applyRows(rows) {
    window.AppData.resetEffective();
    overrideMap.clear();
    rows.forEach((row) => {
      overrideMap.set(mapKey(row.entity_type, row.entity_key, row.field_key), row);
      setEffectiveValue(row.entity_type, row.entity_key, row.field_key, row.value);
    });
  }

  async function initialize() {
    const client = window.AppSupabase.client;
    if (!client) throw window.AppSupabase.initializationError;
    const table = window.AppSession.isAdmin() ? "entity_overrides" : "public_entity_overrides";
    const { data, error } = await client
      .from(table)
      .select("id,entity_type,entity_key,field_key,value,previous_value,updated_at" + (window.AppSession.isAdmin() ? ",updated_by,updated_by_label" : ""));
    if (error) throw error;
    applyRows(data || []);
  }

  async function save(entityType, entityKey, fieldKey, newValue) {
    if (!window.AppSession.isAdmin()) throw new Error("Cette action est réservée aux administrateurs.");
    const oldValue = getEffectiveValue(entityType, entityKey, fieldKey);
    const baselineValue = getBaselineValue(entityType, entityKey, fieldKey);
    const { data, error } = await window.AppSupabase.client.rpc("apply_override", {
      p_entity_type: entityType,
      p_entity_key: String(entityKey),
      p_field_key: fieldKey,
      p_new_value: newValue,
      p_baseline_value: baselineValue,
    });
    if (error) throw error;
    const result = Array.isArray(data) ? data[0] : data;
    if (!result) throw new Error("La sauvegarde n'a retourné aucun résultat.");
    if (!result.was_changed) return { changed: false };

    const row = {
      id: result.override_id,
      entity_type: entityType,
      entity_key: String(entityKey),
      field_key: fieldKey,
      value: newValue,
      previous_value: oldValue,
      updated_at: result.saved_at,
      updated_by: window.AppSession.user?.id,
      updated_by_label: result.author_label,
    };
    overrideMap.set(mapKey(entityType, String(entityKey), fieldKey), row);
    setEffectiveValue(entityType, String(entityKey), fieldKey, newValue);
    return { changed: true, row, historyId: result.history_id };
  }

  function listOverrides({ entityType, entityKeys } = {}) {
    const keySet = entityKeys ? new Set(entityKeys.map(String)) : null;
    return [...overrideMap.values()].filter((row) =>
      (!entityType || row.entity_type === entityType)
      && (!keySet || keySet.has(String(row.entity_key)))
    );
  }

  async function reset(rows) {
    if (!window.AppSession.isAdmin()) throw new Error("Cette action est réservée aux administrateurs.");
    if (!rows.length) return 0;
    const targets = rows.map((row) => ({
      entity_type: row.entity_type,
      entity_key: String(row.entity_key),
      field_key: row.field_key,
      baseline_value: getBaselineValue(row.entity_type, row.entity_key, row.field_key),
    }));
    const { data, error } = await window.AppSupabase.client.rpc("reset_overrides", { p_targets: targets });
    if (error) throw error;

    rows.forEach((row) => {
      const baseline = getBaselineValue(row.entity_type, row.entity_key, row.field_key);
      overrideMap.delete(mapKey(row.entity_type, String(row.entity_key), row.field_key));
      setEffectiveValue(row.entity_type, String(row.entity_key), row.field_key, baseline);
    });
    return Number(data || 0);
  }

  window.AppStore = {
    initialize,
    save,
    reset,
    listOverrides,
    getSpellById,
    getEffectiveValue,
    getBaselineValue,
    getOverride: (entityType, entityKey, fieldKey) => overrideMap.get(mapKey(entityType, String(entityKey), fieldKey)),
    hasOverride: (entityType, entityKey, fieldKey) => overrideMap.has(mapKey(entityType, String(entityKey), fieldKey)),
  };
})();
