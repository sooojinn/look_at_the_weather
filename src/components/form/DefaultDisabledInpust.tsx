type DisabledInputProps = {
  defaultValue: string; // The value of an input is a string
};

export default function DefaultDisabledInput({ defaultValue }: DisabledInputProps) {
  return <input value={defaultValue} className="input h-12 text-lightGray bg-interactive-disabled" readOnly disabled />;
}
