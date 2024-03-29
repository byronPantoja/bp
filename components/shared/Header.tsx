import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import NavItems from './NavItems'
import MobileNav from './MobileNav'

const Header = () => {
  return (
    <header className='w-full border-b'>
      <div className='wrapper flex items-center justify-between'>
        <Link href='/' className='w-36'>
          <Image
            src='/assets/images/logo.svg'
            width={128}
            height={38}
            alt='bp logo'
          />
        </Link>

        <SignedIn>
          <nav className='md:flex-between hidden w-full max-w-xs'>
            <NavItems />
          </nav>
        </SignedIn>
        <div className='flex w-32 justify-end g-3'>
          <SignedIn>
            <div className='pr-2'>
              <UserButton afterSignOutUrl='/' />
            </div>
            <MobileNav />
          </SignedIn>
          <SignedOut>
            <p>Learn.Work.Repeat.</p>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}

export default Header
