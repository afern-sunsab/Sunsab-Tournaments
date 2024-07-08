"use client"
import { useRouter } from 'next/navigation';
import CreateAllEvent from './components/adminSide/CreateEvent';
import ShowAllEvent from "./components/userSide/ShowAllEvent";
import EventsHeader from './homepage/Events-Header';
import HomepageNavbar from './homepage/Navbar';
export default function Home() {
  const router = useRouter();

  const handleSignupClick = () => {
    // Navigate to the CreateAllUser page
    router.push('./signup'); // Replace '/create-user' with the actual route of your CreateAllUser component
  };
  return (
    <div>
      <HomepageNavbar />
      <main className="flex flex-col items-center justify-between p-24 bg-white">
        <div id="events-header" className="section">
          <EventsHeader />
        </div>
        <div id="create-event" className="section">
          <CreateAllEvent />
        </div>
        <div id="show-event" className="section">
          <ShowAllEvent />
        </div>
      </main>
    </div>
  );
}
