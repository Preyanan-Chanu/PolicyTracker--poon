import React from 'react'
import Link from 'next/link'

export const metadata = {
  title: "AboutPage",
  description: "This is webapp for tracking thai policy",
};

function AboutPage() {
  return (
    <div>
       
      <h3>About Page</h3>
      <p>This test</p>
      <Link href="/about/team" className='inline-block bg-purple-500 text-white py-2 px-4 rounded'>Our Team</Link>
    </div>
  )
}

export default AboutPage
