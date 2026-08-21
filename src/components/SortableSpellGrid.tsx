import { useEffect, useMemo, useRef, useState } from "react";
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  arraySwap,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { Spell } from "../types";
import { useDataStore } from "../lib/dataStore";
import { useToastStore } from "../lib/toastStore";
import { errorMessage } from "../lib/utils";
import { DragHandleIcon, SpellIcon } from "./icons";
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeSize, setActiveSize] = useState<{ width: number; height: number } | null>(null);
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
  const activeSpell = activeId ? byId.get(activeId) : null;

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
    const rect = event.active.rect.current.initial;
    setActiveSize(rect ? { width: rect.width, height: rect.height } : null);
  }

  function clearDrag() {
    setActiveId(null);
    setActiveSize(null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const activeId = String(event.active.id);
    const overId = event.over ? String(event.over.id) : null;
    clearDrag();
    if (!overId || activeId === overId) return;
    const oldIndex = ids.indexOf(activeId);
    const newIndex = ids.indexOf(overId);
    if (oldIndex < 0 || newIndex < 0) return;

    const previousIds = ids;
    const nextIds = arraySwap(ids, oldIndex, newIndex);
    const reordered = nextIds.map((id) => byId.get(id)).filter((spell): spell is Spell => Boolean(spell));
    setIds(nextIds);
    saving.current = true;
    try {
      await useDataStore.getState().reorderSpells(className, reordered);
      useToastStore.getState().showToast("Positions des sorts échangées.", "success");
    } catch (error) {
      setIds(previousIds);
      useToastStore.getState().showToast(errorMessage(error), "error");
    } finally {
      saving.current = false;
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToParentElement]}
      autoScroll={false}
      onDragStart={handleDragStart}
      onDragCancel={clearDrag}
      onDragEnd={(event) => void handleDragEnd(event)}
    >
      <SortableContext items={ids} strategy={rectSwappingStrategy}>
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
      <DragOverlay
        dropAnimation={{ duration: 140, easing: "cubic-bezier(.2,.8,.2,1)" }}
        zIndex={50}
      >
        {activeSpell ? (
          <div
            className="spell-tile spell-drag-overlay"
            style={activeSize ? { width: activeSize.width, height: activeSize.height } : undefined}
          >
            <div className="spell-tile-icon"><SpellIcon spell={activeSpell} /></div>
            <span className="spell-tile-name">{activeSpell.nom}</span>
            <span className="spell-drag-handle is-visible" aria-hidden="true"><DragHandleIcon /></span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
