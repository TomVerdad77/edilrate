"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [hasCompany, setHasCompany] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authContextLoading, setAuthContextLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUserContext = async () => {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);

      if (!currentUser) {
        setHasCompany(false);
        setIsAdmin(false);
        setAuthContextLoading(false);
        return;
      }

      const [profileResult, companyResult] = await Promise.all([
        supabase
          .from("profiles")
          .select("role")
          .eq("id", currentUser.id)
          .maybeSingle(),

        supabase
          .from("companies")
          .select("id")
          .eq("claimed_by", currentUser.id)
          .limit(1)
          .maybeSingle(),
      ]);

      setIsAdmin(profileResult.data?.role === "admin");
      setHasCompany(Boolean(companyResult.data));
      setAuthContextLoading(false);
    };

    loadUserContext();
  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const loginWithFacebook = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "facebook",
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between gap-6 py-4">
          {/* Logo */}
          <a
            href="/"
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src="/logo-edilrate.png"
              alt="EdilRate"
              className="h-16 w-auto object-contain"
            />
          </a>

          {/* Navigazione desktop */}
          <nav className="hidden md:flex gap-8 text-sm text-gray-600">
            <a href="/" className="transition hover:text-black">
              Home
            </a>
            <a href="/imprese" className="transition hover:text-black">
              Imprese
            </a>
            <a href="/categorie" className="transition hover:text-black">
              Categorie
            </a>
            <a href="/chi-siamo" className="transition hover:text-black">
              Chi siamo
            </a>
          </nav>

          {/* Azioni desktop */}
          <div className="hidden md:flex gap-3 items-center">
            {user ? (
              <>
                <span className="text-sm text-gray-600">
                  Ciao, {user.user_metadata?.full_name || user.email}
                </span>

                {!authContextLoading && isAdmin && (
                  <a
                    href="/admin"
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
                  >
                    Admin
                  </a>
                )}

                {!authContextLoading && !isAdmin && hasCompany && (
                  <a
                    href="/dashboard"
                    className="rounded-xl bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
                  >
                    Dashboard azienda
                  </a>
                )}

                <button
                  onClick={logout}
                  className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100"
                >
                  Esci
                </button>
              </>
            ) : (
              <>
                <a
                  href="/auth/login"
                  className="rounded-xl border px-4 py-2 text-sm transition hover:bg-gray-100"
                >
                  Accedi
                </a>

                <a
                  href="/auth/register"
                  className="rounded-xl bg-black px-4 py-2 text-sm text-white transition hover:bg-gray-800"
                >
                  Registrati
                </a>
              </>
            )}
          </div>

          {/* Hamburger mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border bg-white text-black transition hover:bg-gray-50 md:hidden"
            aria-label={
              mobileMenuOpen
                ? "Chiudi menu di navigazione"
                : "Apri menu di navigazione"
            }
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Menu mobile */}
        {mobileMenuOpen && (
          <div className="border-t pb-6 pt-4 md:hidden">
            <nav className="flex flex-col">
              <a
                href="/"
                className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black"
              >
                Home
              </a>

              <a
                href="/imprese"
                className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black"
              >
                Imprese
              </a>

              <a
                href="/categorie"
                className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black"
              >
                Categorie
              </a>

              <a
                href="/chi-siamo"
                className="rounded-xl px-3 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-black"
              >
                Chi siamo
              </a>
            </nav>

            <div className="mt-4 border-t pt-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <p className="px-3 text-sm text-gray-500">
                    Ciao, {user.user_metadata?.full_name || user.email}
                  </p>

                  {!authContextLoading && isAdmin && (
                    <a
                      href="/admin"
                      className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Admin
                    </a>
                  )}

                  {!authContextLoading && !isAdmin && hasCompany && (
                    <a
                      href="/dashboard"
                      className="flex w-full items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                    >
                      Dashboard azienda
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={logout}
                    className="w-full rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-gray-100"
                  >
                    Esci
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="/auth/login"
                    className="flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-gray-100"
                  >
                    Accedi
                  </a>

                  <a
                    href="/auth/register"
                    className="flex items-center justify-center rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Registrati
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );}