import { useState, useEffect } from 'react';

function App() {
  const [health, setHealth] = useState<{ status: string; timestamp: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Health check failed:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Customer Sales System
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Module 1 - Project Foundation
          </p>
          
          <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Backend Health
            </h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : health ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">
                  Status: {health.status}
                </p>
                <p className="text-sm text-gray-600">
                  Timestamp: {health.timestamp}
                </p>
              </div>
            ) : (
              <p className="text-red-600">Failed to connect to backend</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
