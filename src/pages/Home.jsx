// src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import yaml from "js-yaml";
import MarkdownRenderer from "../components/Md";
import { BookCard } from "../components/Card";
import { Header } from "../components/Header";

/**
 * Robust pipeline:
 * 1. import.meta.glob(..., { as: "raw", eager: true }) -> raw strings
 * 2. Normalize CRLF -> LF
 * 3. If file starts with ```yaml, strip outer fence
 * 4. Extract frontmatter between --- and --- using regex
 * 5. Parse frontmatter with js-yaml
 * 6. Normalize/convert genre/tags -> arrays, parse rating
 */

export const HomePage = () => {
  const [books, setBooks] = useState([]); // [{ meta: {...}, content, path }]
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    try {
      const modules = import.meta.glob("../Summaries/*.md", {
        as: "raw",
        eager: true,
      });
      console.log("import.meta.glob modules:", modules);

      const list = Object.entries(modules).map(([path, raw]) => {
        // raw should be a string; if not, log it for debugging
        if (typeof raw !== "string") {
          console.error("[MD NOT STRING]", path, raw);
        }

        // 1. Normalize line endings
        let contentStr = String(raw || "").replace(/\r\n/g, "\n");

        // 2. If wrapped in ```yaml ... ``` remove that outer fence first
        //    Many exported markdowns sometimes wrap yaml frontmatter into a fenced block.
        if (contentStr.trimStart().startsWith("```yaml")) {
          // remove leading fence
          // remove the exact leading "```yaml" and the following newline
          const afterFence = contentStr.replace(/^\s*```yaml\s*\n/, "");
          // find closing fence (```) — take content until that closing fence
          const closingIndex = afterFence.indexOf("\n```");
          if (closingIndex !== -1) {
            contentStr = afterFence.slice(0, closingIndex);
          } else {
            // No closing fence found — assume rest is the intended content
            contentStr = afterFence;
          }
        }

        // 3. Extract frontmatter block --- ... ---
        const fmRegex = /^---\n([\s\S]*?)\n---\n?/;
        const fmMatch = contentStr.match(fmRegex);

        let data = {};
        let body = contentStr;

        if (fmMatch) {
          const fmRaw = fmMatch[1];
          try {
            data = yaml.load(fmRaw) || {};
          } catch (e) {
            console.error("YAML parse error in", path, e);
            data = {};
          }
          // remove frontmatter from body
          body = contentStr.replace(fmRegex, "").trim();
        } else {
          // No frontmatter detected — treat whole file as body
          body = contentStr.trim();
        }

        // 4. Normalize fields with safe defaults
        const meta = {
          title: data.title || data.name || "Untitled",
          author: data.author || "Unknown",
          // accept 'genre' or 'genres' and split by / or ,
          genres: data.genres
            ? Array.isArray(data.genres)
              ? data.genres
              : String(data.genres)
                  .split(/[\/,]/)
                  .map((s) => s.trim())
                  .filter(Boolean)
            : data.genre
            ? String(data.genre)
                .split(/[\/,]/)
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
          tags: data.tags
            ? Array.isArray(data.tags)
              ? data.tags
              : String(data.tags)
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
            : [],
          mood: data.mood || data.Mood || "",
          themes: data.themes || data.theme || "",
          rating:
            data.user_rating != null
              ? parseFloat(String(data.user_rating).replace(/[^\d.]/g, "")) || 0
              : data.rating != null
              ? Number(data.rating) || 0
              : 0,
        };

        return { meta, content: body, path };
      });

      setBooks(list);
    } catch (err) {
      console.error("Error loading markdown files:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
      <Header />

      <main className="container mx-auto px-4 py-12">
        {!selectedBook ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((b, i) => (
              <BookCard
                key={`${b.meta.title || "untitled"}-${i}`}
                title={b.meta.title}
                author={b.meta.author}
                rating={b.meta.rating}
                genres={b.meta.genres}
                mood={b.meta.mood}
                themes={b.meta.themes}
                tags={b.meta.tags}
                onClick={() => setSelectedBook(b)}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setSelectedBook(null)}
            >
              ← Back
            </button>

            <h2 className="text-2xl font-bold mb-2 text-indigo-600 dark:text-white">
              {selectedBook.meta.title + " 📖"}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {selectedBook.meta.author} |{" "}
              {(selectedBook.meta.genres || []).join(" / ")} |{" "}
              {selectedBook.meta.mood}
            </p>

            <MarkdownRenderer>{selectedBook.content}</MarkdownRenderer>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;
