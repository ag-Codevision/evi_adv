import React from 'react';
import Header from '@/components/Header';

export default function PodcastLoading() {
  return (
    <>
      <Header />

      <main className="bg-[#f8fafb] min-h-screen py-16">
        <div className="container max-w-6xl">
          {/* Header Skeleton */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="w-32 h-5 bg-slate-200 rounded-full mx-auto animate-pulse" />
            <div className="w-3/4 h-12 bg-slate-200 rounded-2xl mx-auto animate-pulse" />
            <div className="w-full h-16 bg-slate-200 rounded-xl mx-auto animate-pulse" />
          </div>

          {/* Grid Skeleton com animação Shimmer */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm p-0 flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail Placeholder */}
                  <div className="relative aspect-video w-full bg-slate-200 animate-pulse flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-slate-300" />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-24 h-5 bg-slate-200 rounded-full animate-pulse" />
                      <div className="w-16 h-5 bg-slate-200 rounded-md animate-pulse" />
                    </div>
                    <div className="w-full h-6 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="w-4/5 h-6 bg-slate-200 rounded-lg animate-pulse" />
                    <div className="space-y-2 pt-2">
                      <div className="w-full h-4 bg-slate-100 rounded animate-pulse" />
                      <div className="w-full h-4 bg-slate-100 rounded animate-pulse" />
                      <div className="w-2/3 h-4 bg-slate-100 rounded animate-pulse" />
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
