import React, { useEffect } from "react";
import Alert from "@mui/material/Alert";

interface AlertComponentProps {
  tipo: "success" | "info" | "warning" | "error";
  texto: string;
  visible?: boolean;
  timeout?: number;
  onClose?: () => void;
}

const AlertComponent: React.FC<AlertComponentProps> = ({
  tipo,
  texto,
  visible = true,
  timeout = 0,
  onClose,
}) => {
  useEffect(() => {
    if (visible && timeout > 0 && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [visible, timeout, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-xs w-full shadow-lg">
      <Alert severity={tipo}>{texto}</Alert>
    </div>
  );
};

export default AlertComponent;
