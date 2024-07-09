import React from "react";
import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="flex w-full p-2 bg-gray-300 justify-end">
			<Link href='/' className="bg-slate-50 text-black active:bg-blue-400 active:dark:bg-blue-600 ml-6 dark:text-white dark:bg-gray-600 rounded p-2.5"> Home </Link>
			<Link href='login' className="bg-slate-50 text-black active:bg-blue-400 active:dark:bg-blue-600 ml-6 dark:text-white dark:bg-gray-600 rounded p-2.5"> Login </Link>
			<Link href='signup' className="bg-slate-50 text-black active:bg-blue-400 active:dark:bg-blue-600 ml-6 dark:text-white dark:bg-gray-600 rounded p-2.5"> Sign Up </Link>
			<Link href='create' className="bg-slate-50 text-black active:bg-blue-400 active:dark:bg-blue-600 ml-6 dark:text-white dark:bg-gray-600 rounded p-2.5">Create</Link>
		</nav>
	);
}
