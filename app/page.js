import ShowAllEvent from "./components/userSide/ShowAllEvent";
import CreateAllEvent from "./components/adminSide/CreateEvent";

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-between p-24 bg-white">
      <div>
        <CreateAllEvent />
        <ShowAllEvent />
      </div>
    </main>
  );
}
