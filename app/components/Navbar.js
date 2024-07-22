'use client'
import { useUserAuth } from '@utils/auth-context';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  const { user } = useUserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuth();
  }, [user]);
  
  console.log('User:', user);
  
  return (
    <nav className={`navbar bg-base-100 h-20 flex ${styles.navbar}`}>
      <div className={`flex ${styles.linkContainer} ml-auto`}>
        {loading ? null : (
          !user ? (
            <>
              <Link href="/login" className={styles.linkStyle}>Login</Link>
              <Link href="/signup" className={styles.linkStyle}>Sign Up</Link>
            </>
          ) : (
            <>
              <Link href="/tournaments" className={styles.linkStyle}>Tournaments</Link>
              <Link href="/create" className={styles.linkStyle}>Create</Link>
            </>
          )
        )}
      </div>
    </nav>
  );
}
