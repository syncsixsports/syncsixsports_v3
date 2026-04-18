export default function SearchBar() {
  return (
    <div className="flex-1">
      <input
        type="text"
        placeholder="Search players..."
        className="
          w-full
          px-4 py-3
          rounded-xl
          bg-white/5
          border border-white/10
          text-white
          placeholder-gray-400
          outline-none
          focus:border-[#dbf93a]
          transition
        "
      />
    </div>
  );
}