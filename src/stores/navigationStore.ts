import { create } from 'zustand';

interface NavigationState {
  showAppEntryOverlay: boolean;
  setShowAppEntryOverlay: (show: boolean) => void;
}

export const useNavigationStore = create<NavigationState>(set => ({
  showAppEntryOverlay: false,
  setShowAppEntryOverlay: show => set({ showAppEntryOverlay: show }),
}));
