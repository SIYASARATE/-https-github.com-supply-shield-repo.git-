import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import './App.css'; 

function App() {
  const [activeRole, setActiveRole] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [pin, setPin] = useState('');

  const [productCode, setProductCode] = useState('');
  const [secureQrData, setSecureQrData] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selectedRole) return alert("Please select a role first!");
    if (pin === '1234') {
      setActiveRole(selectedRole);
    } else {
      alert("⚠️ Cryptographic PIN mismatch. Access Denied.");
    }
  };

  const handleLogout = () => {
    setActiveRole(null);
    setSelectedRole('');
    setPin('');
    setSecureQrData(null);
    setProductCode('');
  };

  // PREMIUM LOGIN PAGE WITH BACKGROUND IMAGE
  if (!activeRole) {
    return (
      <div style={{ 
        textAlign: 'center', padding: '50px', minHeight: '100vh',
        backgroundImage: 'linear-gradient(rgba(13, 59, 68, 0.8), rgba(13, 59, 68, 0.9)), url("https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2070&auto=format&fit=crop")',
        backgroundSize: 'cover', backgroundPosition: 'center', color: 'white',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <h1 style={{ fontSize: '3rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', margin: '0 0 10px 0' }}>SupplyShield</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '40px', color: '#e0e0e0' }}>Zero-Trust Authentication Gateway</p>
        
        <form onSubmit={handleLogin} style={{ 
          display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '350px', 
          backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(12px)', 
          padding: '40px 30px', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.2)', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: 'white' }}>Command Center Login</h3>
          
          <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', outline: 'none', fontSize: '15px', cursor: 'pointer', color: '#333' }}>
            <option value="">-- Select Clearance Level --</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="QROperator">QR Operator</option>
            <option value="Auditor">Auditor</option>
            <option value="Scanner">Scanner</option>
          </select>

          <input type="password" placeholder="Enter Secure PIN " value={pin} onChange={(e) => setPin(e.target.value)} style={{ padding: '12px', borderRadius: '8px', border: 'none', outline: 'none', fontSize: '15px', color: '#333' }} />
          
          <button type="submit" style={{ padding: '14px', backgroundColor: '#20b2aa', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', transition: '0.3s', boxShadow: '0 4px 15px rgba(32, 178, 170, 0.4)' }}>
            Authenticate System
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#0d3b44', color: 'white', padding: '15px', borderRadius: '8px' }}>
        <h2>SupplyShield | {activeRole} Access</h2>
        <button onClick={handleLogout} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '5px', cursor: 'pointer' }}>Logout</button>
      </header>
      
      <main style={{ marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0,0,0,0.1)' }}>
        
        {/* ================= ADMIN DASHBOARD ================= */}
        {activeRole === 'Admin' && (
          <div>
            <h2 style={{ color: '#0d3b44', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Admin: Employee & Software Access Management</h2>
            
            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ flex: 1, padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '1px solid #cce0ff' }}>
                <h3 style={{ marginTop: 0, color: '#0050b3' }}>Software Access Control</h3>
                <p>Global System Status: <strong style={{ color: 'green' }}>Online & Secure</strong></p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => alert('✅ System Access Granted: Secure token generated and sent to employee.')} style={{...btnStyle, backgroundColor: '#20b2aa'}}>
                    Grant New Access
                  </button>
                  <button onClick={() => alert('🚨 Security Alert: Master access revoked. All active sessions terminated.')} style={{...btnStyle, backgroundColor: '#d9363e'}}>
                    Revoke Master Access
                  </button>
                </div>
              </div>
            </div>

            <h3 style={{ color: '#0d3b44' }}>Employee Records (CRUD)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#1a5f6e', color: 'white' }}>
                  <th style={thStyle}>Emp ID</th><th style={thStyle}>Name</th><th style={thStyle}>Role</th><th style={thStyle}>Status</th><th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={tdStyle}>EMP-101</td><td style={tdStyle}>Mohit Kumar</td><td style={tdStyle}>Manager</td><td style={tdStyle}>✅ Active</td>
                  <td style={tdStyle}>
                    <button style={actionBtnEdit} onClick={() => alert('Edit panel opened for Mohit')}>Edit / Update</button>
                    <button style={actionBtnDelete} onClick={() => alert('Record deleted successfully!')}>Delete</button>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid #ddd', backgroundColor: '#fafafa' }}>
                  <td style={tdStyle}>EMP-102</td><td style={tdStyle}>Priya Sharma</td><td style={tdStyle}>Scanner</td><td style={tdStyle}>✅ Active</td>
                  <td style={tdStyle}>
                    <button style={actionBtnEdit} onClick={() => alert('Edit panel opened for Priya')}>Edit / Update</button>
                    <button style={actionBtnDelete} onClick={() => alert('Record deleted successfully!')}>Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* ================= MANAGER DASHBOARD ================= */}
        {activeRole === 'Manager' && (
          <div>
            <h2 style={{ color: '#0d3b44', borderBottom: '2px solid #ccc', paddingBottom: '10px' }}>Manager: Live Tracking & Process Dashboard</h2>
            
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
              
              <div style={cardStyle}>
                <h4 style={cardHeader}>Deadline Schedule & Process</h4>
                <ul style={{ paddingLeft: '20px', margin: 0 }}>
                  <li style={{ marginBottom: '10px' }}>📦 Batch 101 - <span style={{ color: 'orange' }}>Dispatch by 2:00 PM (Pending)</span></li>
                  <li style={{ marginBottom: '10px' }}>📦 Batch 99 - <span style={{ color: 'green' }}>Delivered (Process Complete)</span></li>
                  <li>📦 Batch 102 - <span style={{ color: 'blue' }}>Packaging Phase</span></li>
                </ul>
              </div>

              <div style={cardStyle}>
                <h4 style={cardHeader}>Live GPS Tracker</h4>
                <div style={{ height: '100px', backgroundColor: '#e6f7ff', borderRadius: '5px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px dashed #1890ff' }}>
                  <span style={{ fontSize: '24px' }}>📍🗺️</span>
                  <strong>Truck MP09-AB-1234</strong>
                  <span style={{ fontSize: '12px', color: '#555' }}>En route to Checkpoint B</span>
                </div>
              </div>

              <div style={{...cardStyle, width: '100%'}}>
                <h4 style={cardHeader}>All System & Incorrect Logs</h4>
                <div style={{ backgroundColor: '#222', color: '#0f0', padding: '15px', borderRadius: '5px', fontFamily: 'monospace', height: '150px', overflowY: 'auto' }}>
                  <p style={{ margin: '5px 0' }}>[10:00 AM] INFO: All process started smoothly.</p>
                  <p style={{ margin: '5px 0' }}>[10:15 AM] SUCCESS: Batch 101 QR generated.</p>
                  <p style={{ margin: '5px 0', color: '#ff4d4f' }}>[10:30 AM] ERROR (Incorrect Log): Unauthorized PIN entry at Gate 3.</p>
                  <p style={{ margin: '5px 0', color: '#ff4d4f' }}>[10:45 AM] WARNING (Incorrect Log): GPS signal lost for 2 mins on Truck MP09.</p>
                  <p style={{ margin: '5px 0' }}>[11:00 AM] SUCCESS: Scanner verified 50 boxes.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= QR OPERATOR ================= */}
        {activeRole === 'QROperator' && (
          <div>
            <h3 style={{ color: '#0d3b44' }}>Batch Logistics Operator</h3>
            <p>Your sole task is to register new products and generate encrypted QRs.</p>
            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff' }}>
              <h3 style={{ color: '#0d3b44', marginTop: 0 }}>Live Encrypted QR Generation</h3>
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px', marginBottom: '20px' }}>
                <input type="text" placeholder="Enter Product Code" value={productCode} onChange={(e) => setProductCode(e.target.value)} style={inputStyle} />
                <button onClick={() => { if(!productCode) return alert("Enter Code!"); setSecureQrData(`gAAAAABkX_${productCode}_SecureHash9901`); }} style={{...btnStyle, backgroundColor: '#20b2aa'}}>Encrypt & Generate QR</button>
              </div>
              {secureQrData && (
                <div style={{ padding: '20px', backgroundColor: '#f0f8ff', borderRadius: '8px', border: '1px solid #cce0ff', display: 'inline-block' }}>
                  <QRCodeSVG value={secureQrData} size={150} />
                  <p style={{ marginTop: '15px', fontSize: '14px', color: '#555' }}><strong>Encrypted Payload:</strong> <br/> {secureQrData}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= AUDITOR ================= */}
        {activeRole === 'Auditor' && (
          <div>
            <h3 style={{ color: '#0d3b44' }}>System Security & Immutable Audits</h3>
            <ul style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', listStyleType: 'none', margin: 0 }}>
              <li style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>✅ [10:42 AM] - QR Operator generated batch 'Box-101'</li>
              <li style={{ padding: '10px', borderBottom: '1px solid #ddd', color: 'red', fontWeight: 'bold' }}>🚨 [11:05 AM] - ALERT: Scanner 2 reported shortage at Checkpoint B</li>
            </ul>
          </div>
        )}

        {/* ================= SCANNER (SIMULATED) ================= */}
        {activeRole === 'Scanner' && (
          <div>
            <h3 style={{ color: '#0d3b44' }}>Checkpoint QR Scanner</h3>
            <div style={{ padding: '40px', border: '2px dashed #ccc', textAlign: 'center', backgroundColor: '#fafafa', marginBottom: '20px' }}>
              <p style={{ color: '#888' }}>📷 Active Camera Feed (Waiting for Scan)</p>
              <button onClick={() => alert('✅ Verification Successful!\n\nPayload: gAAAAABkX_Box-101_SecureHash9901\nStatus: Authentic')} style={{...btnStyle, backgroundColor: '#0d3b44'}}>
                Simulate Scan Verification
              </button>
            </div>
            <button onClick={() => alert('🚨 Red Alert! Shortage flagged. This event has been permanently recorded in Logs.')} style={{...btnStyle, backgroundColor: '#e63946', width: '100%'}}>
              FLAG ISSUE / SHORTAGE
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

const btnStyle = { padding: '10px 15px', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const actionBtnEdit = { padding: '5px 10px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '5px' };
const actionBtnDelete = { padding: '5px 10px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' };
const inputStyle = { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '200px' };
const thStyle = { padding: '12px', border: '1px solid #ddd' };
const tdStyle = { padding: '12px', border: '1px solid #ddd' };
const cardStyle = { flex: '1 1 300px', padding: '20px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e8e8e8', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const cardHeader = { margin: '0 0 15px 0', color: '#0d3b44', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' };

export default App;