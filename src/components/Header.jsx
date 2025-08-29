export const Header = () => {
  return (
    <header className="sticky top-4 backdrop-blur-sm bg-white/70 dark:bg-gray-900/70 shadow-sm z-10">
      <div className="container mx-auto px-4 py-3 flex justify-center items-center">
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <span>📚</span> {`Book Summaries - "A reader lives a thousand lives before he dies… The one who never reads lives only one." `}
        </h1>
      </div>
    </header>
  );
};
