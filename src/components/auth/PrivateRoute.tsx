"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PrivateRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Só faz o redirecionamento se não estiver carregando e não estiver autenticado
    if (!isLoading && !isAuthenticated && pathname.startsWith("/private")) {
      // Redirecionar para a página de login com query param de retorno
      router.push(`/?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, pathname, router, isLoading]);

  // Se estiver carregando, mostra um estado de carregamento ou nada
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FFF8E8]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Se não estiver autenticado, não renderiza o conteúdo
  if (!isAuthenticated && pathname.startsWith("/private")) {
    return null;
  }

  // Se estiver autenticado ou não for uma rota privada, renderiza normalmente
  return <>{children}</>;
}
