import SearchBar from "./SearchBar";
import FilterButton from "./FilterButton";

export default function SearchFiltersRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <SearchBar />
      <FilterButton />
    </div>
  );
}