import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Bank } from "@/lib/api";

/**
 * A searchable bank picker. Type part of a bank's name to filter the list;
 * pick a bank from the results. Replaces a plain select, which is hard to use
 * with a long list of banks.
 */
export default function BankPicker({
  id,
  banks,
  value,
  onChange,
  placeholder = "Search your bank",
}: {
  id: string;
  banks: Bank[];
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
}) {
  const selected = banks.find((bank) => bank.code === value);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return banks;
    return banks.filter((bank) => bank.name.toLowerCase().includes(q));
  }, [banks, query]);

  const listId = `${id}-options`;

  return (
    <div className="relative">
      <input
        id={id}
        type="text"
        role="combobox"
        autoComplete="off"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder={placeholder}
        value={open ? query : selected?.name ?? ""}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onBlur={() => {
          setOpen(false);
          setQuery("");
        }}
        onChange={(event) => {
          setOpen(true);
          setQuery(event.target.value);
        }}
        className="input pr-9"
      />
      <ChevronDown
        size={15}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />

      {open && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-30 mt-1 max-h-64 w-full overflow-y-auto rounded-xl border border-line bg-white py-1 shadow-lg"
        >
          {matches.length === 0 ? (
            <li className="px-3 py-2 text-[13px] text-ink-muted">
              No bank matches “{query.trim()}”
            </li>
          ) : (
            matches.map((bank) => (
              <li
                key={bank.code}
                role="option"
                aria-selected={bank.code === value}
                // Keep focus in the input so the click registers before blur closes the list.
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  onChange(bank.code);
                  setOpen(false);
                  setQuery("");
                }}
                className={`cursor-pointer px-3 py-2 text-[13px] hover:bg-line-soft ${
                  bank.code === value ? "font-semibold text-ink" : "text-ink-muted"
                }`}
              >
                {bank.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
