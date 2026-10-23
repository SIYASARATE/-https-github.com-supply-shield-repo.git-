import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  // State variables for API data
  const [stats, setStats] = useState({ products: 0, shipments: 0, alerts: 0 });
  const [recentScans, setRecentScans] = useState([]);

  // Fetch data when component loads
  useEffect(() => {
    // Fetch Dashboard Stats
    fetch('http://localhost:8000/api/stats')
      .then(response => response.json())
      .then(data => setStats(data))
      .catch(error => console.error("Error fetching stats:", error));

    // Fetch Recent Scans
    fetch('http://localhost:8000/api/recent-scans')
      .then(response => response.json())
      .then(data => setRecentScans(data))
      .catch(error => console.error("Error fetching scans:", error));
  }, []);

  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#0d3b44', borderBottom: '2px solid #0d3b44', paddingBottom: '10px' }}>
        SupplyShield Admin Dashboard
      </h2>

      {/* 1. Quick Stats Section */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
        <div style={{ flex: 1, padding: '20px', background: '#f4f6f8', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Total Products</h3>
          <h1 style={{ color: '#0d3b44', margin: '10px 0' }}>{stats.products}</h1>
        </div>
        <div style={{ flex: 1, padding: '20px', background: '#f4f6f8', borderRadius: '8px', textAlign: 'center' }}>
          <h3>Active Shipments</h3>
          <h1 style={{ color: '#0d3b44', margin: '10px 0' }}>{stats.shipments}</h1>
        </div>
        <div style={{ flex: 1, padding: '20px', background: '#ffebee', borderRadius: '8px', textAlign: 'center' }}>
          <h3 style={{ color: '#d32f2f' }}>Security Alerts</h3>
          <h1 style={{ color: '#d32f2f', margin: '10px 0' }}>{stats.alerts}</h1>
        </div>
      </div>

      {/* 2. Security Alerts Section */}
      <div style={{ marginBottom: '30px', padding: '15px', background: '#ffcdd2', borderRadius: '8px', borderLeft: '5px solid #d32f2f' }}>
        <h3 style={{ color: '#b71c1c', margin: '0 0 10px 0' }}>⚠️ Action Required</h3>
        <p style={{ margin: 0 }}>QR-8891 (ThinkPad T14) flagged for shortage at Checkpoint Alpha.</p>
      </div>

      {/* 3. Recent Activity Table */}
      <div>
        <h3 style={{ color: '#0d3b44' }}>Recent QR Scans</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ background: '#0d3b44', color: 'white', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>Scan ID</th>
              <th style={{ padding: '12px' }}>Product</th>
              <th style={{ padding: '12px' }}>Time</th>
              <th style={{ padding: '12px' }}>Status</th>
              <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Location 📍</th>
            </tr>
          </thead>
          <tbody>
            {recentScans.map((scan, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #ddd', background: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                <td style={{ padding: '12px' }}>{scan.id}</td>
                <td style={{ padding: '12px' }}>{scan.item}</td>
                <td style={{ padding: '12px' }}>{scan.time}</td>
                <td style={{ padding: '12px', color: scan.status === 'Verified' ? 'green' : 'red', fontWeight: 'bold' }}>
  {scan.status}
</td>
<td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
  {scan.location || "N/A"}
</td>
</tr>
    ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;