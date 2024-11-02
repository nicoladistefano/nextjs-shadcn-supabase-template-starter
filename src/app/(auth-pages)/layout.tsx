export default function Layout({ children }: { children: React.ReactNode }) {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-7xl p-6">
          {children}
        </div>
      </div>
  );
}
