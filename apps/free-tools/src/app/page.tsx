"use client";

import { useState } from "react";

interface Joke {
  setup: string;
  punchline: string;
}

export default function Home() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchJoke() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/free-tools/api/joke");
      if (!response.ok) {
        throw new Error("Failed to fetch joke");
      }
      const data = await response.json();
      setJoke(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Random Joke Generator</h1>
        <p className="text-lg text-gray-600">
          Click the button to get a random joke!
        </p>

        <button
          onClick={fetchJoke}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Loading..." : "Get Joke"}
        </button>

        {error && <p className="text-red-500">{error}</p>}

        {joke && (
          <div className="p-4 bg-gray-100 rounded-lg max-w-md">
            <p className="font-medium">{joke.setup}</p>
            <p className="mt-2 text-gray-700">{joke.punchline}</p>
          </div>
        )}
      </main>
    </div>
  );
}
