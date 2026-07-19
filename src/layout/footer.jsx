export const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 text-xs text-gray-500">
        <p>
          © 2026{" "}
          <span className="font-medium text-[#4F30A9]">
            Finance Dashboard
          </span>
          . All rights reserved.
        </p>

        <p className="hidden sm:block">
          v1.0.0
        </p>
      </div>
    </footer>
  );
};