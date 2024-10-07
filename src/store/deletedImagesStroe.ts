import { create } from 'zustand';

interface DeletedImagesState {
  deletedDefaultImageIds: number[];
  setDeletedDefaultImageIds: (ids: number[]) => void;
  reset: () => void;
}

export const useDeletedImagesStore = create<DeletedImagesState>()((set) => ({
  deletedDefaultImageIds: [],
  setDeletedDefaultImageIds: (deletedDefaultImageIds: number[]) => set({ deletedDefaultImageIds }),
  reset: () => set({ deletedDefaultImageIds: [] }),
}));
