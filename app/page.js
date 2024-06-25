import CreateAllEvent from "./components/CreateEvent";
import ShowAllEvent from "./components/ShowAllEvent";
import Navbar from "./components/navbar";

export default function Home() {
  return (
    <main>
      <div>
        <Navbar />
      </div>
      <div className="flex min-h-screen flex-col items-center bg-white">
        <CreateAllEvent />
        <ShowAllEvent />
      </div>
    </main>
  );
}
