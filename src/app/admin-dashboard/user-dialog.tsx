import { useState, useEffect } from "react"

interface User {
  displayName?: string
  email?: string
  password?: string
  userType?: string
}

interface UserDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (user: User) => void
  user?: User
  mode: "add" | "edit"
}

export function UserDialog({ isOpen, onClose, onSave, user, mode }: UserDialogProps) {
  const [editedUser, setEditedUser] = useState({
    ...user,
    password: "",
  })

  useEffect(() => {
    setEditedUser({
      ...user,
      password: "",
    })
  }, [user])

  if (!isOpen) return null

  const handleSave = () => {
    onSave(editedUser)
    onClose()
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-full items-end justify-center text-center">
        <div className="relative w-full max-w-lg p-4 overflow-hidden text-left transition-all transform bg-white shadow-xl rounded-lg">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {mode === "edit" ? "Edit User" : "Add New User"}
            </h3>
            <div className="mt-2 space-y-4">
              <input
                type="text"
                value={editedUser.displayName || ""}
                onChange={(e) => setEditedUser({ ...editedUser, displayName: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Name"
              />
              <input
                type="email"
                value={editedUser.email || ""}
                onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Email"
              />
              {mode === "add" && (
                <input
                  type="password"
                  value={editedUser.password || ""}
                  onChange={(e) => setEditedUser({ ...editedUser, password: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              )}
              <select
                value={editedUser.userType || "manager"}
                onChange={(e) => setEditedUser({ ...editedUser, userType: e.target.value })}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSave}
            >
              {mode === "edit" ? "Save" : "Add"}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

