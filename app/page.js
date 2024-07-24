"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between p-24 bg-white relative min-h-screen">
      <img
        src="https://fastly.picsum.photos/id/416/1280/853.jpg?hmac=B9Bc5K0QP3GbA6b2Dsfmjm_YpNCOlB_5zm6ZCXUnoHw"
        className="absolute top-0 left-0 w-full h-full object-cover"
        alt="Background Image"
      />
      <div className="relative z-20 max-w-screen-lg mx-auto grid grid-cols-12 h-full items-center">
        <div className="col-span-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            Tournament's made easy
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <Link href="/tournaments">
            <button
              type="button"
              className="bg-[#FED136] hover:bg-[#EFBB35] text-black font-bold py-2.5 px-8 rounded-full transition duration-300 transform hover:scale-105 w-full text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              Get Started
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
