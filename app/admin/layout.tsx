import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b border-white/10 px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-cyan">
          portfol.io
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <Link href="/admin/upload" className="hover:text-cyan transition-colors">
            upload
          </Link>
          <Link href="/admin/manage" className="hover:text-cyan transition-colors">
            manage artworks
          </Link>
          <div className="w-px h-4 bg-white/20"></div>
          <span className="text-white/50">{session.user?.name || session.user?.email}</span>
        </div>
      </nav>
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
