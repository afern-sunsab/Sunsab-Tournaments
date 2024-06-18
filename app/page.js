import Image from "next/image";
import CreateAllEvent from "./components/CreateEvent";
import ShowAllEvent from "./components/ShowAllEvent";
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
        <div className="flex">
          <CreateAllEvent/>
          <ShowAllEvent/>
        </div>
    </main>
  );
}
