"use client"
import { useRouter } from 'next/navigation';
import CreateAllEvent from './components/adminSide/CreateEvent';
export default function Home() {
  const router = useRouter();

  const handleSignupClick = () => {
    // Navigate to the CreateAllUser page
    router.push('./signup'); // Replace '/create-user' with the actual route of your CreateAllUser component
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-white">
        <div >
          <CreateAllEvent/>
        </div>
    </main>
  );
}
