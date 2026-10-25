import React from 'react'

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-2">
          <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
          <div className="h-7 w-64 bg-slate-200 rounded-lg animate-pulse" />
        </div>
        <div className="h-9 w-36 bg-slate-200 rounded-xl animate-pulse" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="w-8 h-8 rounded-lg bg-slate-200 animate-pulse" />
            </div>
            <div className="h-8 w-16 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>

      {/* Main Card/Table Skeleton */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="h-6 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="space-y-2.5 pt-2">
          {[1, 2, 3, 4, 5].map((row) => (
            <div key={row} className="h-12 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}

