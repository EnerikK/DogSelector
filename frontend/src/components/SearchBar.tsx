import { useState } from "react";

interface Props {
  onSearch: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder,
}: Props) {
  const [inputValue, setInputValue] = useState("");

  const handleSearch = () => {
    onSearch(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="input-group mb-3" style={{ maxWidth: 400 }}>
      <input
        type="text"
        className="form-control"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        className="btn btn-primary"
        onClick={handleSearch}
      >
        <i className="bi bi-search"></i>
      </button>
    </div>
  );
}