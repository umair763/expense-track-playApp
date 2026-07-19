import { useAuth } from "../common";

export const Navbar = () => {
  const { user } = useAuth();

  const initials = user?.userName
    ? user.userName
        .split(" ")
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "U";

  return (
    <header className="fixed top-0 right-0 z-20 w-full bg-white shadow-sm border-b border-gray-100">
      <div className="flex h-16 items-center justify-end gap-3 px-4">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block leading-tight">
            <p className="text-sm font-semibold text-gray-900">
              {user?.userName || "Guest"}
            </p>
          </div>

          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.userName}
              className="h-9 w-9 rounded-xl border-2 border-[#4F30A9] object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4F30A9] text-sm font-semibold text-white">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};