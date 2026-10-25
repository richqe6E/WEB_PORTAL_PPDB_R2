import React from 'react'

export default function PublicLoading() {
  return (
    <div className="bg-[#f8fafc] min-h-[calc(100vh-200px)]">
      {/* Sleek Line Loader (Inspired by Uiverse satyamchaudharydev) */}
      <div className="w-full">
        <div className="pmb-line-loader" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
        {/* Hero Skeleton */}
        <div className="bg-white rounded-lg border border-[#DFE3E9] p-8 shadow-xs space-y-4">
          <div className="h-5 w-40 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-3/4 bg-slate-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
          <div className="h-11 w-44 bg-emerald-200/60 rounded-md animate-pulse pt-2" />
        </div>

        {/* Grid Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-[#DFE3E9] p-6 shadow-xs space-y-3"
            >
              <div className="h-5 w-24 bg-slate-200 rounded animate-pulse" />
              <div className="h-6 w-36 bg-slate-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
              <div className="h-10 w-full bg-slate-200 rounded-md animate-pulse mt-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

