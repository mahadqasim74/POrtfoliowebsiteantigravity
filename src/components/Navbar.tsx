import Link from 'next/link'

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="#" className="text-xl font-bold text-white">
                    Mahad Qasim
                </Link>

                <ul className="hidden md:flex items-center gap-8">
                    <li><Link href="#experience" className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium">Experience</Link></li>
                    <li><Link href="#education" className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium">Education</Link></li>
                    <li><Link href="#skills" className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium">Skills</Link></li>
                    <li><Link href="#certifications" className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium">Certifications</Link></li>
                    <li><Link href="#publications" className="text-slate-300 hover:text-yellow-400 transition-colors text-sm font-medium">Publications</Link></li>
                    <li>
                        <Link href="#contact" className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-2 rounded-md font-bold transition-colors text-sm">
                            Contact
                        </Link>
                    </li>
                </ul>

                {/* Mobile menu button could be added here */}
            </div>
        </nav>
    )
}
