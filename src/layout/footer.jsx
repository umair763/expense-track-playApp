
export const Footer = () => {
  return (
    <footer
      className="
         w-full
         bg-white
         border-t
         border-gray-200
         py-4
      "
    >
      <div
        className="
            max-w-7xl
            mx-auto
            px-5
            flex
            flex-col
            sm:flex-row
            justify-between
            items-center
            gap-2
            text-sm
            text-gray-500
         "
      >
        <p>© 2026 Finance Dashboard</p>

        <div
          className="
               flex
               items-center
               gap-1.5
            "
        ></div>
      </div>
    </footer>
  )
}
