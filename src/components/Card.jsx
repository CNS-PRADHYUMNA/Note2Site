// src/components/BookCard.jsx
/* eslint-disable react/prop-types */

export const BookCard = ({
  title = "Untitled",
  author = "Unknown",
  rating = 0,
  genres = [],
  mood = "",
  themes = "",
  tags = [],
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg hover:shadow-xl border border-white/20 dark:border-gray-700/30 transition-all duration-300 hover:scale-[1.02] hover:border-primary-300/50 dark:hover:border-primary-700/50"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-purple-500/5 dark:from-primary-500/10 dark:to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white">
            {title}
          </h3>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={
                  i < rating
                    ? "text-yellow-400"
                    : "text-gray-300 dark:text-gray-600"
                }
              >
                ★
              </span>
            ))}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-300 mb-3">{author}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {(genres || []).map((g) => (
            <span
              key={g}
              className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
            >
              {g}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Mood:</span> {mood}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-medium">Themes:</span> {themes}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {(tags || []).map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookCard;
