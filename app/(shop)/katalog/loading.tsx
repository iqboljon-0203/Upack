export default function KatalogLoading() {
  return (
    <div className="container mx-auto px-6 py-12 animate-pulse">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="h-8 w-48 bg-slate-200 rounded-lg mb-4"></div>
          <div className="h-4 w-64 bg-slate-100 rounded-lg"></div>
        </div>
        <div className="w-full md:w-auto flex gap-4">
          <div className="w-full md:w-80 h-12 bg-slate-100 rounded-xl"></div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="h-6 w-32 bg-slate-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
              <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
              <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
              <div className="h-10 w-full bg-slate-100 rounded-lg"></div>
            </div>
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex flex-col h-96">
                <div className="w-full h-48 bg-slate-100 shrink-0"></div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="h-5 w-3/4 bg-slate-200 rounded mb-3"></div>
                  <div className="h-4 w-full bg-slate-100 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-slate-100 rounded mb-6"></div>
                  
                  <div className="mt-auto flex justify-between items-end">
                    <div>
                      <div className="h-3 w-16 bg-slate-100 rounded mb-2"></div>
                      <div className="h-6 w-24 bg-slate-200 rounded"></div>
                    </div>
                    <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
