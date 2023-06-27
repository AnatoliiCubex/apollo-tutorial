import React, { useEffect, useState } from "react";

import { AUTH_TOKEN } from "../constants";
import { useRouter } from "next/router";
import Link from "next/link";

const Header = () => {
  const router = useRouter();
  const authToken =
    typeof window !== "undefined" && localStorage.getItem(AUTH_TOKEN);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className='flex pa1 justify-between nowrap orange w85 center'>
      <div className='flex flex-fixed black'>
        <Link href='/' className='no-underline black'>
          <div className='fw7 mr1'>Hacker News</div>
        </Link>
        <Link href='/' className='ml1 no-underline black'>
          Links
        </Link>
        <div className='ml1'>|</div>
        <Link href='/search' className='ml1 no-underline black'>
          Search
        </Link>
        {authToken && (
          <div className='flex'>
            <div className='ml1'>|</div>
            <Link href='/create-link' className='ml1 no-underline black'>
              Add link
            </Link>
          </div>
        )}
      </div>
      <div className='flex flex-fixed'>
        {authToken ? (
          <div
            className='ml1 pointer black'
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              router.push(`/`);
            }}
          >
            logout
          </div>
        ) : (
          <Link href='/login' className='ml1 no-underline black'>
            login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;
