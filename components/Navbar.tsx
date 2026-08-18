'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed z-50 w-full border-b border-white/10 bg-black/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="text-2xl font-bold tracking-tight text-white hover:text-gray-300 transition-colors">
            ALVB
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/10 text-sm font-medium tracking-wide"
            >
              HOME
            </Link>
            <Link
              href="/about"
              className="text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/10 text-sm font-medium tracking-wide"
            >
              ABOUT
            </Link>
            <Link
              href="/portfolio"
              className="text-gray-300 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/10 text-sm font-medium tracking-wide"
            >
              REFERENCE
            </Link>
            <Link
              href="/quote"
              className="ml-4 bg-white text-black px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-gray-200 transition-all duration-300"
            >
              QUOTE
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white p-2"
            aria-expanded={isOpen}
            aria-label="메뉴 열기"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-6 border-t border-white/10 mt-2">
            <div className="flex flex-col space-y-2 pt-4" style={{fontFamily: 'system-ui, -apple-system, sans-serif'}}>
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10 text-sm font-medium tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                HOME
              </Link>
              <Link
                href="/about"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10 text-sm font-medium tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                ABOUT
              </Link>
              <Link
                href="/portfolio"
                className="text-gray-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/10 text-sm font-medium tracking-wide"
                onClick={() => setIsOpen(false)}
              >
                REFERENCE
              </Link>
              <Link
                href="/quote"
                className="bg-white text-black px-6 py-2.5 text-sm font-medium tracking-wide hover:bg-gray-200 transition-colors text-center mt-2"
                onClick={() => setIsOpen(false)}
              >
                QUOTE
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
