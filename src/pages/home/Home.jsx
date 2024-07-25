import React from 'react'
import Hero from './Hero'
import AboutUs from './AboutUs'
import Contact from './Contact'

export default function Home() {
  return (
    <div className='font-header font-semibold'>Home

        <Hero/>
        <AboutUs/>
        <Contact/>
    </div>
  )
}
