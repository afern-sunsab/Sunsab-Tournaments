"use client"
import CreateAllEvent from "./components/CreateEvent";
import ShowAllEvent from "./components/ShowAllEvent";
import Navbar from "./components/navbar";
import { useRouter } from 'next/navigation';
import CreateAllEvent from './components/adminSide/CreateEvent';
import SingleElimination from './components/adminSide/singleElimination';

export default function Home() {
  const router = useRouter();

  const handleSignupClick = () => {
    // Navigate to the CreateAllUser page
    router.push('./signup'); // Replace '/create-user' with the actual route of your CreateAllUser component
  };
  return (
    <main className="flex  flex-col items-center justify-between p-24 bg-white">
      <div>
        <Navbar />
      </div>
      <div>
        <CreateAllEvent />
        <ShowAllEvent />
      </div>
    </main>
  );
}
