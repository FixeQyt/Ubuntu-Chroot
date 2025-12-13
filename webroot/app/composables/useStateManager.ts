import { reactive, toRefs } from "vue";

type StorageValue = string | null;

type StorageAPI = {
  get: (key: string, defaultValue?: string | null) => string | null;
  set: (key: string, value: string) => void;
  remove: (key: string) => void;
  getBoolean: (key: string, defaultValue?: boolean) => boolean;
  getJSON: <T = any>(key: string, defaultValue?: T | null) => T | null;
  setJSON: (key: string, value: any) => void;
};

type StateKeys = "hotspot" | "forwarding" | "debug" | "sparse";

type StateManagerAPI = {
  // reactive state object (expose via toRefs for reactivity in components)
  state: {
    hotspot: boolean;
    forwarding: boolean;
    debug: boolean;
    sparse: boolean;
  };

  // read/write single state value
  get: (name: StateKeys) => boolean;
  set: (name: StateKeys, value: boolean) => void;

  // load/save all states from/to storage
  loadAll: () => void;
  saveAll: () => void;
};

// Create a safe storage wrapper.
// It gracefully handles environments where localStorage isn't available.
function createStorage(): StorageAPI {
  function safeLocalStorage() {
    try {
      if (typeof window === "undefined") return null;
      if (!("localStorage" in window)) return null;
      return window.localStorage;
    } catch {
      return null;
    }
  }

  function get(key: string, defaultValue: string | null = null): string | null {
    const ls = safeLocalStorage();
    if (!ls) return defaultValue;
    try {
      const v = ls.getItem(key);
      return v !== null ? v : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  function set(key: string, value: string): void {
    const ls = safeLocalStorage();
    if (!ls) return;
    try {
      ls.setItem(key, String(value));
    } catch {
      // ignore
    }
  }

  function remove(key: string): void {
    const ls = safeLocalStorage();
    if (!ls) return;
    try {
      ls.removeItem(key);
    } catch {
      // ignore
    }
  }

  function getBoolean(key: string, defaultValue = false): boolean {
    const raw = get(key);
    if (raw === null) return defaultValue;
    return raw === "true";
  }

  function getJSON<T = any>(
    key: string,
    defaultValue: T | null = null,
  ): T | null {
    const raw = get(key);
    if (raw === null) return defaultValue;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return defaultValue;
    }
  }

  function setJSON(key: string, value: any) {
    try {
      set(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }

  return {
    get,
    set,
    remove,
    getBoolean,
    getJSON,
    setJSON,
  };
}

// Create a simple state manager that persists boolean feature flags.
function createStateManager(storage: StorageAPI): StateManagerAPI {
  // mapping of names -> storage key + defaults
  const statesMeta: Record<StateKeys, { key: string; default: boolean }> = {
    hotspot: { key: "hotspot_active", default: false },
    forwarding: { key: "forwarding_active", default: false },
    debug: { key: "debug_mode_active", default: false },
    sparse: { key: "sparse_migrated", default: false },
  };

  // Reactive object used by UI/components.
  const state = reactive({
    hotspot: storage.getBoolean(
      statesMeta.hotspot.key,
      statesMeta.hotspot.default,
    ),
    forwarding: storage.getBoolean(
      statesMeta.forwarding.key,
      statesMeta.forwarding.default,
    ),
    debug: storage.getBoolean(statesMeta.debug.key, statesMeta.debug.default),
    sparse: storage.getBoolean(
      statesMeta.sparse.key,
      statesMeta.sparse.default,
    ),
  });

  function get(name: StateKeys): boolean {
    return state[name];
  }

  function set(name: StateKeys, value: boolean) {
    state[name] = !!value;
    try {
      storage.set(statesMeta[name].key, String(state[name]));
    } catch {
      // ignore storage issues silently
    }
  }

  function loadAll() {
    (Object.keys(statesMeta) as StateKeys[]).forEach((k) => {
      state[k] = storage.getBoolean(statesMeta[k].key, statesMeta[k].default);
    });
  }

  function saveAll() {
    (Object.keys(statesMeta) as StateKeys[]).forEach((k) => {
      try {
        storage.set(statesMeta[k].key, String(state[k]));
      } catch {
        // ignore
      }
    });
  }

  return {
    state,
    get,
    set,
    loadAll,
    saveAll,
  };
}

// Composable that exposes a singleton Storage object and StateManager.
// This returns the singleton instances to keep the app consistent.
export const Storage: StorageAPI = createStorage();
export const StateManager: StateManagerAPI = createStateManager(Storage);

// Named composable (useStateManager) to get reactive refs & helpers.
export function useStateManager() {
  return {
    state: toRefs(StateManager.state), // provides: { hotspot, forwarding, ... } as refs
    get: StateManager.get,
    set: StateManager.set,
    loadAll: StateManager.loadAll,
    saveAll: StateManager.saveAll,
    Storage,
    StateManager,
  };
}

// Named composable for storage only (for explicit usage)
export function useStorage() {
  return {
    Storage,
  };
}

export default useStateManager;
