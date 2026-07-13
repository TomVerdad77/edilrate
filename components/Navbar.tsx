"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/src/lib/supabase";


export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [hasCompany, setHasCompany] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authContextLoading, setAuthContextLoading] = useState(true);

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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <a href="/" className="flex items-center">
          <img
            src="/logo-edilrate.png"
            alt="EdilRate"
            className="h-16 w-auto object-contain"
          />
        </a>

        <nav className="hidden md:flex gap-8 text-sm text-gray-600">
          <a href="/" className="hover:text-black transition">Home</a>
          <a href="/imprese" className="hover:text-black transition">Imprese</a>
          <a href="/imprese" className="hover:text-black transition">Categorie</a>
          <a href="/chi-siamo" className="hover:text-black transition">Chi siamo</a>
        </nav>

        <div className="flex gap-3 items-center">
          {user ? (
            <>
              <span className="hidden md:block text-sm text-gray-600">
                Ciao, {user.user_metadata?.full_name || user.email}
              </span>

              {!authContextLoading && isAdmin && (
  <a
    href="/admin"
    className="px-4 py-2 text-sm bg-black text-white rounded-xl transition hover:bg-gray-800"
  >
    Admin
  </a>
)}

{!authContextLoading && !isAdmin && hasCompany && (
  <a
    href="/dashboard"
    className="px-4 py-2 text-sm bg-black text-white rounded-xl transition hover:bg-gray-800"
  >
    Dashboard azienda
  </a>
)}

              <button
                onClick={logout}
                className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-100 transition"
              >
                Esci
              </button>
            </>
          ) : (
            <>
  <a
    href="/auth/login"
    className="px-4 py-2 text-sm border rounded-xl hover:bg-gray-100 transition"
  >
    Accedi
  </a>

  <a
    href="/auth/register"
    className="hidden md:block px-4 py-2 text-sm bg-black text-white rounded-xl hover:bg-gray-800 transition"
  >
    Registrati
  </a>
</>
          )}
        </div>
      </div>
    </header>
  );
}