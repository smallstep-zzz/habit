import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
  persist(
    (set, get) => ({
      user: null, // { email: string, nickname: string, createdAt: Date }
      habits: [], // { id: string, title: string, completed: boolean, createdAt: Date }
      records: {}, // { "YYYY-MM-DD": { [habitId]: { score: number, skipped: boolean } } }
      
      setUser: (user) => set({ user }),
      
      addHabit: (title) => set((state) => ({
        habits: [...state.habits, { id: Date.now().toString(), title, completed: false, createdAt: new Date() }]
      })),
      
      updateHabit: (id, updates) => set((state) => ({
        habits: state.habits.map(h => (h.id === id ? { ...h, ...updates } : h))
      })),
      
      deleteHabit: (id) => set((state) => ({
        habits: state.habits.filter(h => h.id !== id)
      })),
      
      addRecord: (dateStr, habitId, recordData) => set((state) => ({
        records: {
          ...state.records,
          [dateStr]: {
            ...state.records[dateStr],
            [habitId]: recordData // { score: number, skipped: boolean }
          }
        }
      })),
      
      logout: () => set({ user: null, habits: [], records: {} })
    }),
    {
      name: 'dajim-storage', // unique name
    }
  )
);

export default useStore;
