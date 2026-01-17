'use client'
import React from 'react'
import Image from 'next/image'
import travlogo from '../public/travlogo.png'
import Link from 'next/link'
import Button from './Button'
import { ThemeToggle } from './ThemeToggle'

const Navbar = () => {
  return (
    <header className='flex items-center justify-between p-5'>
      <div className="flex items-center gap-2">
        <Image src={travlogo} alt="TravYotei Logo" width={55} height={55} />
        <h1 className='text-2xl font-bold font-sans'>TRAV<span className='bg-blue'>YOTEI</span></h1>
      </div>
      <nav className='flex items-center gap-3'>
        <Link href='/' className='text-foreground/70 font-bold hover:text-foreground transition-colors'>HOME</Link>
        <Link href='/Agencies' className='text-foreground/70 font-bold hover:text-foreground transition-colors'>AGENCIES</Link>
        <Link href="/Dashboard" className='text-foreground/70 font-bold hover:text-foreground transition-colors'>DASHBOARD</Link>
        <Link href="/Tracking" className='text-foreground/70 font-bold hover:text-foreground transition-colors'>TRACKING</Link>
      </nav>
      <div className='flex items-center gap-4'>
        <ThemeToggle />
        <Button
          label="login"
          className="bg-blue-600 text-white"
        />
        <Button
          label="Profile"
          className="bg-blue-600 text-white"
        />
      </div>
    </header>
  )
}

export default Navbar