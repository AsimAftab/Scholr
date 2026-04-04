import Link from "next/link";
import React from "react";

import { User } from "@/lib/types";

interface CTASectionProps {
  user: User | null;
}

export default function CTASection({ user }: CTASectionProps) {
  return (
    <section className="px-5 pb-20 md:px-10">
      <div className="mx-auto max-w-7xl rounded-3xl bg-zinc-950 px-8 py-16 text-center text-white md:px-16 md:py-20">
        <h2 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
          Start building a scholarship pipeline that actually helps you decide.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link 
            href={user ? "/dashboard" : "/sign-up"} 
            className="rounded-md bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100"
          >
            {user ? "Go to Dashboard" : "Create free account"}
          </Link>
          {!user && (
            <Link 
              href="/sign-in" 
              className="rounded-md border border-zinc-700 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
