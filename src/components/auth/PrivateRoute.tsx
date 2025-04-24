"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Se não estiver autenticado e estiver tentando acessar uma rota privada
    if (!isAuthenticated && pathname.startsWith("/private")) {
      // Redirecionar para a página de login com query param de retorno
      router.push(`/?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router]);

  // Se não estiver autenticado, não renderiza o conteúdo
  if (!isAuthenticated && pathname.startsWith("/private")) {
    return null;
  }

  // Se estiver autenticado ou não for uma rota privada, renderiza normalmente
  return <>{children}</>;
}
