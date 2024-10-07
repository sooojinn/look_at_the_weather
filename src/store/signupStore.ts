import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SignupState {
  isEmailVerified: boolean;
  isCodeSended: boolean;
  isNicknameChecked: boolean;
  setIsEmailVerified: (value: boolean) => void;
  setIsCodeSended: (value: boolean) => void;
  setIsNicknameChecked: (value: boolean) => void;
  resetSignupState: () => void;
}

const useSignupStore = create<SignupState>()(
  devtools(
    (set) => ({
      isEmailVerified: false,
      isCodeSended: false,
      isNicknameChecked: false,
      setIsEmailVerified: (value: boolean) => set({ isEmailVerified: value }),
      setIsCodeSended: (value: boolean) => set({ isCodeSended: value }),
      setIsNicknameChecked: (value: boolean) => set({ isNicknameChecked: value }),
      resetSignupState: () =>
        set({
          isEmailVerified: false,
          isCodeSended: false,
          isNicknameChecked: false,
        }),
    }),
    { name: 'Signup Store' },
  ),
);

export default useSignupStore;
