import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ResumeData, CoverLetterData } from "@/types";
import { createEmptyResume, createEmptyCoverLetter } from "@/lib/default";
import { generateId } from "@/lib/utils";

const MAX_HISTORY = 5;

interface AppStore {
  // Active resume
  activeResume: ResumeData;
  setActiveResume: (r: ResumeData) => void;
  updateActiveResume: (partial: Partial<ResumeData>) => void;
  resetActiveResume: () => void;

  // Active cover letter
  activeCoverLetter: CoverLetterData;
  setActiveCoverLetter: (cl: CoverLetterData) => void;
  updateActiveCoverLetter: (partial: Partial<CoverLetterData>) => void;

  // History — max 5
  history: ResumeData[];
  saveToHistory: (resume?: ResumeData) => void;
  deleteFromHistory: (id: string) => void;
  loadFromHistory: (id: string) => void;

  // UI
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      activeResume: createEmptyResume(),
      setActiveResume: (r) => set({ activeResume: r }),
      updateActiveResume: (partial) =>
        set(s => ({ activeResume: { ...s.activeResume, ...partial, updatedAt: new Date().toISOString() } })),
      resetActiveResume: () => set({ activeResume: createEmptyResume() }),

      activeCoverLetter: createEmptyCoverLetter(),
      setActiveCoverLetter: (cl) => set({ activeCoverLetter: cl }),
      updateActiveCoverLetter: (partial) =>
        set(s => ({ activeCoverLetter: { ...s.activeCoverLetter, ...partial } })),

      history: [],
      saveToHistory: (resume) => {
        const r = resume || get().activeResume;
        const updated = { ...r, updatedAt: new Date().toISOString() };
        set(s => {
          const filtered = s.history.filter(x => x.id !== r.id);
          const newHistory = [updated, ...filtered].slice(0, MAX_HISTORY);
          return { history: newHistory };
        });
      },
      deleteFromHistory: (id) =>
        set(s => ({ history: s.history.filter(r => r.id !== id) })),
      loadFromHistory: (id) => {
        const r = get().history.find(x => x.id === id);
        if (r) set({ activeResume: r });
      },

      isProcessing: false,
      setIsProcessing: (v) => set({ isProcessing: v }),
    }),
    { name: "mygresume-store" }
  )
);