import { useEffect, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";
import { SpellTile } from "./SpellTile";

interface SortableSpellGridProps {
  className: string;
  spells: Spell[];
  selectedId: string | null;
  onSelect: (spell: Spell) => void;
}

function orderedIds(spells: Spell[]): string[] {
  return [...spells]
    .sort((left, right) => (left.position ?? Number.MAX_SAFE_INTEGER) - (right.position ?? Number.MAX_SAFE_INTEGER))
    .map((spell) => String(spell.id));
}

export function SortableSpellGrid({ className, spells, selectedId, onSelect }: SortableSpellGridProps) {
  const expectedIds = useMemo(() => orderedIds(spells), [spells]);
  const [ids, setIds] = useState(expectedIds);
  const saving = useRef(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    if (!saving.current) setIds(expectedIds);
  }, [expectedIds]);

  const byId = new Map(spells.map((spell) => [String(spell.id), spell]));
  const visibleSpells = ids.map((id) => byId.get(id)).filter((spell): spell is Spell => Boolean(spell));

  async function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    if (!overId || activeId === overId) return;
    const oldIndex = ids.indexOf(activeId);
    const newIndex = ids.indexOf(overId);
    if (oldIndex < 0 || newIndex < 0) return;

    const previousIds = ids;
    const nextIds = arrayMove(ids, oldIndex, newIndex);
    const reordered = nextIds.map((id) => byId.get(id)).filter((spell): spell is Spell => Boolean(spell));
    setIds(nextIds);
    saving.current = true;
    try {
      await useDataStore.getState().reorderSpells(className, reordered);
      useToastStore.getState().showToast("Ordre des sorts enregistré.", "success");
    } catch (error) {
      setIds(previousIds);
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      saving.current = false;
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(event) => void handleDragEnd(event)}>
      <SortableContext items={ids} strategy={rectSortingStrategy}>
        <div className="spell-grid">
          {visibleSpells.map((spell) => (
            <SpellTile
              key={spell.id}
              spell={spell}
              selected={String(spell.id) === selectedId}
              onSelect={() => onSelect(spell)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
