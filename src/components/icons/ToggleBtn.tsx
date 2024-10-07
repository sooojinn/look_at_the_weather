interface ToggleBtnProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  showTerms: boolean;
}

export default function ToggleBtn({ onClick, showTerms }: ToggleBtnProps) {
  return (
    <button onClick={onClick} className={`${showTerms ? 'transform rotate-180' : ''}`}>
      <ToggleIcon />
    </button>
  );
}

function ToggleIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 2.43637L1.5975 0.838867L9 8.24137L16.4025 0.838867L18 2.43637L9 11.4364L0 2.43637Z" fill="#858588" />
    </svg>
  );
}
