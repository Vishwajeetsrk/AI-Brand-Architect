export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#07081a] flex items-center justify-center">
      {children}
    </div>
  );
}
