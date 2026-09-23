import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = { title: "Admin sign in", robots: { index: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getSession()) redirect("/admin");
  const { next } = await searchParams;
  return (
    <main className="surface-dark grid min-h-dvh place-items-center bg-ink px-6">
      <div className="w-full max-w-sm">
        <Logo alt="Lifeinpeaks" priority className="mb-10 w-56" />
        <p className="eyebrow">Admin</p>
        <h1 className="mt-3 font-display text-5xl text-mist">Welcome back.</h1>
        <LoginForm next={next ?? "/admin"} />
      </div>
    </main>
  );
}
