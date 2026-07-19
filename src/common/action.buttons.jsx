import { Eye, SquarePen, Trash2 } from 'lucide-react'

export const ActionButtons = ({
  showView = true,
  showEdit = true,
  showDelete = true,
  onView,
  onEdit,
  onDelete,
  size = 18,
}) => {
  return (
    <div className="flex items-center justify-end">
      {showView && (
        <button
          type="button"
          onClick={onView}
          title="View"
          className="
            flex h-9 w-9 cursor-pointer items-center justify-center
            rounded-lg
            text-gray-500
            transition-all
            hover:bg-blue-50
            hover:text-blue-600
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500/20       
          "
        >
          <Eye size={size} />
        </button>
      )}

      {showEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Edit"
          className="
            flex h-9 w-9 cursor-pointer items-center justify-center
            rounded-lg
            text-gray-500
            transition-all
            hover:bg-purple-50
            hover:text-purple-600
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500/20
          "
        >
          <SquarePen size={size} />
        </button>
      )}

      {showDelete && (
        <button
          type="button" 
          onClick={onDelete}
          title="Delete"
          className="
            flex h-9 w-9 cursor-pointer items-center justify-center
            rounded-lg
            text-gray-500
            transition-all
            hover:bg-red-50
            hover:text-red-600
            focus:outline-none
            focus:ring-2
            focus:ring-red-500/20
          "
        >
          <Trash2 size={size} />
        </button>
      )}
    </div>
  )
}
