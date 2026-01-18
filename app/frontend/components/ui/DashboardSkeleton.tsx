"use client";

import { SkeletonCard, SkeletonText } from "./SkeletonCard";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar skeleton */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-20 animate-pulse"></div>
          </div>
        </div>
      </nav>

      {/* Main content skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User info card skeleton */}
        <SkeletonCard className="mb-6" />

        {/* Feature cards grid skeleton */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>

        {/* Info banner skeleton */}
        <div className="mt-6 bg-gray-100 border border-gray-200 rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <SkeletonText className="w-full" />
          <SkeletonText className="w-5/6 mt-2" />
        </div>
      </main>
    </div>
  );
}
