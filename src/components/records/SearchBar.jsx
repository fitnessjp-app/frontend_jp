import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, delay = 350 }) => {
  const [term, setTerm] = useState(value || '');
  const timerRef = useRef(null);

  useEffect(() => setTerm(value || ''), [value]);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const push = (v) => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => onChange(v), delay);
  };

  const handleChange = (e) => {
    setTerm(e.target.value);
    push(e.target.value);
  };

  const clear = () => {
    setTerm('');
    clearTimeout(timerRef.current);
    onChange('');
  };

  return (
    <div className="relative flex-1 min-w-0">
      <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
      <input
        value={term}
        onChange={handleChange}
        type="search"
        enterKeyHint="search"
        placeholder="Search name or mobile…"
        className="w-full pl-10 pr-10 py-3 rounded-xl bg-navy-800 border border-navy-700 text-white placeholder-gray-500 focus:outline-none focus:border-accent"
      />
      {term && (
        <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white" aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
