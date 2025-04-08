"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Search } from "lucide-react"

interface SimpleTableProps<T> {
  data: T[]
  columns: {
    header: string
    accessorKey: keyof T
    cell?: (item: T) => React.ReactNode
  }[]
  onDelete?: (id: string) => void
}

export function SimpleTable<T extends { id: string }>({ data, columns, onDelete }: SimpleTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Filter data based on search term
  const filteredData = data.filter((item) => {
    return Object.values(item as Record<string, any>).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(searchTerm.toLowerCase())
      }
      return false
    })
  })

  // Paginate data
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const totalPages = Math.ceil(filteredData.length / pageSize)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 border rounded-md px-3 py-2 w-[250px]">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="border-none outline-none text-sm w-full bg-transparent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-2 py-1 text-sm border rounded ${
              currentPage === 1 ? "text-gray-300" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-2 py-1 text-sm border rounded ${
              currentPage === totalPages || totalPages === 0 ? "text-gray-300" : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Next
          </button>
        </div>
      </div>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-4 py-3 font-medium text-gray-500">
                  {column.header}
                </th>
              ))}
              <th className="px-4 py-3 font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="bg-white">
                  {columns.map((column) => (
                    <td key={column.header} className="px-4 py-3">
                      {column.cell ? column.cell(item) : (item[column.accessorKey] as React.ReactNode)}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/${item.id}`} className="text-blue-600 hover:text-blue-800">
                        View
                      </Link>
                      <Link href={`/admin/${item.id}/edit`} className="text-blue-600 hover:text-blue-800">
                        Edit
                      </Link>
                      {onDelete && (
                        <button onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800">
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-500">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end text-sm text-gray-500">
        Page {currentPage} of {totalPages || 1}
      </div>
    </div>
  )
}

