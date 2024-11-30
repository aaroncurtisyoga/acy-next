"use client";

import { useState, useEffect, ReactNode, FC } from "react";

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ClientOnly: FC<ClientOnlyProps> = ({ children, fallback = null }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Render fallback (e.g., spinner) or nothing while client-only content loads
  if (!hasMounted) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ClientOnly;
