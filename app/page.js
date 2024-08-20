"use client";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-sunsab-yellow to-sunsab-blue">
      <div className="text-center">
        <h1 className="text-8xl md:text-9xl font-bold text-sunsab-white mb-6">
          SunSab Tournaments
        </h1>
        <p className="text-3xl md:text-4xl text-sunsab-white mb-12">
          Discover and participate in the best tournaments
        </p>
        <a
          href="/tournaments"
          className="bg-white text-sunsab-blue font-medium rounded-full px-8 py-4 hover:bg-sunsab-yellow transition-colors duration-300"
        >
          View Tournaments
        </a>
      </div>
    </main>
  );
}
