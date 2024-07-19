import Image from "next/image";
import Link from "next/link";
import TestAccount from '../../public/icons/TestAccount.svg';
import styles from '../styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={`navbar bg-base-100 h-20 flex ${styles.navbar}`}>
      <div className={`flex ${styles.linkContainer}`}>
        <Link href='/login' className={styles.linkStyle}> Login </Link>
        <Link href='/signup' className={styles.linkStyle}> Sign Up </Link>
        <Link href='/tournaments' className={styles.linkStyle}> Tournaments </Link>
        <Link href='/create' className={styles.linkStyle}> Create </Link>
        <div className={styles.imageStyle}>
          <Image
            src={TestAccount}
            alt="Profile Icon"
            width={40}
            height={40}
          />
        </div>
      </div>
    </nav>
  );
}

