/**
 * Shared "active technology" state between the Stack and Projects islands.
 * Framework-agnostic and compatible with React's useSyncExternalStore.
 */
export interface SelectionSnapshot {
  selected: string | null
  previewed: string | null
  active: string | null
}

const EMPTY_SNAPSHOT: SelectionSnapshot = { selected: null, previewed: null, active: null }

export interface SelectionStore {
  getSnapshot: () => SelectionSnapshot
  /** Always empty: islands hydrate against the server HTML, then catch up. */
  getServerSnapshot: () => SelectionSnapshot
  subscribe: (listener: () => void) => () => void
  toggle: (skill_id: string) => void
  preview: (skill_id: string | null) => void
  clear: () => void
}

export function createSelectionStore(): SelectionStore {
  let snapshot = EMPTY_SNAPSHOT
  const listeners = new Set<() => void>()

  const update = (selected: string | null, previewed: string | null): void => {
    snapshot = { selected, previewed, active: previewed ?? selected }
    for (const listener of listeners) listener()
  }

  return {
    getSnapshot: () => snapshot,
    getServerSnapshot: () => EMPTY_SNAPSHOT,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    toggle: (skill_id) =>
      update(snapshot.selected === skill_id ? null : skill_id, snapshot.previewed),
    preview: (skill_id) => update(snapshot.selected, skill_id),
    clear: () => update(null, null),
  }
}

/** Singleton shared by every island on the page. */
export const selection_store = createSelectionStore()
