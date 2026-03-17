interface AlertMessageProps {
  kind: "error" | "success";
  message: string | null;
}

export function AlertMessage({ kind, message }: AlertMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <aside
      className={`banner banner-${kind}`}
      role="status"
      aria-live="polite"
      aria-label={kind === "error" ? "Error" : "Success"}
    >
      {message}
    </aside>
  );
}
