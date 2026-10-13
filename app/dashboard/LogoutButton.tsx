"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "../../lib/auth-client";

export default function LogoutButton() {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function logout() {
    setError("");
    setPending(true);
    const result = await authClient.signOut();
    setPending(false);

    if (result.error) {
      setError("Could not log out. Please try again.");
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  return <div className="flex flex-col items-end gap-2"><button type="button" className="btn border" onClick={logout} disabled={pending}>{pending ? "Logging out..." : "Log out"}</button>{error && <p className="text-sm text-red-600">{error}</p>}</div>;
}
