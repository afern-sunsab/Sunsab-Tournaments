"use client"
import { useRouter } from 'next/navigation';
import CreateAllEvent from './components/adminSide/CreateEvent';
import ShowAllEvent from "./components/userSide/ShowAllEvent";
import EventsHeader from './homepage/Events-Header';

export default function Home() {
  const router = useRouter();

  const handleSignupClick = () => {
    // Navigate to the CreateAllUser page
    router.push('./signup'); // Replace '/create-user' with the actual route of your CreateAllUser component
  };
  return (
    <main className="flex  flex-col items-center justify-between p-24 bg-white">
      <div>
        <EventsHeader/>
        <CreateAllEvent />
        <ShowAllEvent />
      </div>
    </main>
  );
}
