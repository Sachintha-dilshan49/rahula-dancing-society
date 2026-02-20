interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "outline";
}

export default function Button({
  children,
  variant = "primary",
}: ButtonProps) {
  const base =
    "px-6 py-3 rounded-lg font-medium transition-all duration-300 hover:scale-105 active:scale-95";

  const styles =
    variant === "primary"
      ? "bg-[var(--rahula-gold)] text-[var(--rahula-blue)] hover:opacity-90"
      : "border border-white text-white hover:bg-white hover:text-[var(--rahula-blue)]";

  return <button className={`${base} ${styles}`}>{children}</button>;
}