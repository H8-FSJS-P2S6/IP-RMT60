export default function DashboardSkeleton() {
  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4 mb-4">Dashboard</h1>
      
      {/* Stat Cards Skeleton */}
      <div className="row g-4 mb-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="col-xl-3 col-md-6">
            <div className="card bg-light h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="placeholder-glow w-75">
                    <div className="placeholder col-5 mb-2"></div>
                    <div className="placeholder col-7"></div>
                  </div>
                  <div className="placeholder col-2 rounded-circle"></div>
                </div>
              </div>
              <div className="card-footer">
                <div className="placeholder col-4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Charts Skeleton */}
      <div className="row mb-4">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <div className="placeholder col-4"></div>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center" style={{height: "300px"}}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header">
              <div className="placeholder col-6"></div>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center" style={{height: "300px"}}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tables Skeleton */}
      <div className="row">
        {[1, 2].map(i => (
          <div key={i} className="col-lg-6">
            <div className="card mb-4">
              <div className="card-header">
                <div className="placeholder col-4"></div>
              </div>
              <div className="card-body">
                <table className="table">
                  <thead>
                    <tr>
                      {[1, 2, 3, 4].map(j => (
                        <th key={j}>
                          <div className="placeholder col-12"></div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4, 5].map(row => (
                      <tr key={row}>
                        {[1, 2, 3, 4].map(col => (
                          <td key={col}>
                            <div className="placeholder col-12"></div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}