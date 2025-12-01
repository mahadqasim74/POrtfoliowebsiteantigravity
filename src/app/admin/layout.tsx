import Link from 'next/link'
import { LayoutDashboard, User, Briefcase, GraduationCap, Wrench, Award, FolderGit2, BookOpen, LogOut } from 'lucide-react'
import { DeployButton } from '@/components/admin/DeployButton'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold">Admin Portal</h1>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <User className="w-5 h-5" />
                        Profile
                    </Link>
                    <Link href="/admin/experience" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <Briefcase className="w-5 h-5" />
                        Experience
                    </Link>
                    <Link href="/admin/education" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <GraduationCap className="w-5 h-5" />
                        Education
                    </Link>
                    <Link href="/admin/skills" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <Wrench className="w-5 h-5" />
                        Skills
                    </Link>
                    <Link href="/admin/certifications" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <Award className="w-5 h-5" />
                        Certifications
                    </Link>
                    <Link href="/admin/projects" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <FolderGit2 className="w-5 h-5" />
                        Projects
                    </Link>
                    <Link href="/admin/publications" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                        <BookOpen className="w-5 h-5" />
                        Publications
                    </Link>
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <DeployButton />
                    <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-900/50 text-red-400 hover:text-red-300 transition-colors">
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    )
}
