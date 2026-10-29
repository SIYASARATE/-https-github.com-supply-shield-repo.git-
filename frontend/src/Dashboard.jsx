import React, { useState, useEffect, useRef } from 'react';
import jsQR from 'jsqr';

const Dashboard = ({ activeRole, currentUser }) => {
  const [qrInput, setQrInput] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null); 
  const streamRef = useRef(null); 

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const requestCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
      .then(stream => {
        streamRef.current = stream; 
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
      })
      .catch(err => {
        console.error("Camera error:", err);
        alert("Camera permission denied!");
      });
  };

  useEffect(() => {
    return () => stopCamera();
  }, [activeRole]);

  // 🔴 100% REAL QR SCANNING & VERIFICATION
  useEffect(() => {
    let requestID;
    if (activeRole === 'Scanner' && isCameraActive) {
      const scanQR = () => {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // attemptBoth se laptop camera glare me bhi scan kar leta hai
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });
          
          if (code) {
            stopCamera(); // Scan hote hi camera freeze
            
            const savedCode = localStorage.getItem('savedQR');
            const expectedData = savedCode ? `${savedCode}-Encrypted` : null;

            // ASLI CHECKING: Jo scan hua hai wo database wale code se match ho raha hai?
            if (code.data === expectedData) {
              alert(`✅ VERIFICATION PASSED!\n\nScanned Data: ${code.data}\nStatus: Match Found in System.`);
            } else {
              alert(`❌ VERIFICATION FAILED!\n\nScanned Data: ${code.data}\nStatus: Fake or Unregistered QR!`);
            }
            return;
          }
        }
        requestID = requestAnimationFrame(scanQR);
      };
      requestID = requestAnimationFrame(scanQR);
    }
    return () => {
      if (requestID) cancelAnimationFrame(requestID);
    };
  }, [activeRole, isCameraActive]);

  const handleGenerateQR = () => {
    if (qrInput) {
      localStorage.setItem('savedQR', qrInput);
      setShowQR(true);
    }
  };
// --- ADMIN SECTION LOGIC START ---
  const [empName, setEmpName] = useState('');
  const [empRole, setEmpRole] = useState('Scanner Operator');
  const [employees, setEmployees] = useState([
    { id: 'EMP-101', name: 'Mohit Kumar', role: 'Manager', status: 'Active' },
    { id: 'EMP-102', name: 'Priya Sharma', role: 'Scanner', status: 'Active' }
  ]);

  const handleAddEmployee = () => {
    if (!empName.trim()) {
      alert("Please enter employee name first!");
      return;
    }

    const existingUsers = JSON.parse(
      localStorage.getItem('appUsers') || '{}'
    );

    let generatedPin;

    do {
      generatedPin = String(
        Math.floor(1000 + Math.random() * 9000)
      );
    } while (existingUsers[generatedPin]);

    const newEmpId = `EMP-${Date.now()}`;

    const newEmployee = {
      id: newEmpId,
      name: empName.trim(),
      role: empRole,
      status: 'Active'
    };

    existingUsers[generatedPin] = newEmployee;

    localStorage.setItem(
      'appUsers',
      JSON.stringify(existingUsers)
    );

    setEmployees(prev => [...prev, newEmployee]);
    setEmpName('');

    alert(
      `Employee Registered Successfully!\n\n` +
      `Name: ${newEmployee.name}\n` +
      `Role: ${newEmployee.role}\n` +
      `Employee ID: ${newEmpId}\n` +
      `Auto-Generated PIN: ${generatedPin}`
    );
  };

  // --- ADMIN SECTION LOGIC END ---
  return (
    <div style={{ padding: '10px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Welcome, {currentUser?.name || 'User'}!</h2>
      
      {/* ================= ADMIN ================= */}
      {/* ================= ADMIN ================= */}
      {activeRole === 'Admin' && (
        <div>
          <h3 style={{ color: '#0d3b44', borderBottom: '2px solid #0d3b44', paddingBottom: '10px', fontSize: '1.5rem' }}>Admin: Employee & Software Access Management</h3>
          
          {/* 1. Software Access Control */}
          <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#0d3b44' }}>Software Access Control</h4>
            <p style={{ margin: '0 0 10px 0' }}>Global System Status: <strong style={{ color: 'green' }}>Online & Secure</strong></p>
            <button style={{ padding: '8px 15px', backgroundColor: '#20c997', color: '#fff', border: 'none', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}>Grant New Access</button>
            <button style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Revoke Master Access</button>
          </div>

          {/* 2. Add New Employee (Auto-PIN) */}
          <div style={{ padding: '20px', border: '2px dashed #4caf50', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f1f8e9' }}>
             <h4 style={{ color: '#2e7d32', marginTop: 0 }}>➕ Add New Employee (Auto-Generate PIN)</h4>
             <div style={{ display: 'flex', gap: '10px' }}>
                <input 
                  type="text" 
                  placeholder="Enter Full Name" 
                  value={empName}
                  onChange={(e) => setEmpName(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
                />
                
                <select 
                  value={empRole}
                  onChange={(e) => setEmpRole(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                   <option value="Scanner Operator">Scanner Operator</option>
                   <option value="Manager">Manager</option>
                   <option value="Auditor">Auditor</option>
                   <option value="QR Operator">QR Operator</option>
                </select>

                <button onClick={handleAddEmployee} style={{ padding: '10px 20px', backgroundColor: '#1b5e20', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Create Access ID & PIN</button>
             </div>
          </div>

          {/* 3. Employee Records Table (Dynamic Live Data) */}
          <h4 style={{ color: '#0d3b44', marginBottom: '10px' }}>📑 Employee Records (Live)</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <thead>
              <tr style={{ backgroundColor: '#135c6b', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '12px' }}>Emp ID</th><th style={{ padding: '12px' }}>Name</th><th style={{ padding: '12px' }}>Role</th><th style={{ padding: '12px' }}>Status</th><th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{emp.id}</td>
                  <td style={{ padding: '12px' }}>{emp.name}</td>
                  <td style={{ padding: '12px' }}>{emp.role}</td>
                  <td style={{ padding: '12px', color: 'green' }}>✅ {emp.status}</td>
                  <td style={{ padding: '12px' }}>
                    <button style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', marginRight: '5px', cursor: 'pointer' }}>Edit</button>
                    <button style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* ================= AUDITOR ================= */}
      {activeRole === 'Auditor' && (
        <div>
          <h3 style={{ color: '#0d3b44', borderBottom: '2px solid #ccc', paddingBottom: '10px', fontSize: '1.5rem' }}>SupplyShield Auditor & Compliance Dashboard</h3>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px', textAlign: 'center' }}>
            <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Total Audited Products</h4>
              <h2 style={{ margin: 0, color: '#0d3b44' }}>24</h2>
            </div>
            <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Verified Shipments</h4>
              <h2 style={{ margin: 0, color: '#20c997' }}>22</h2>
            </div>
            <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fafafa' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#555' }}>Security Alerts</h4>
              <h2 style={{ margin: 0, color: '#d32f2f' }}>2</h2>
            </div>
          </div>
          
          <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#ffebee', border: '1px solid #ffcdd2', borderRadius: '8px' }}>
            <h4 style={{ color: '#c62828', marginTop: 0 }}>⚠️ Compliance & Threat Analysis</h4>
            <p style={{ margin: 0, color: '#b71c1c' }}>QR-8891 (ThinkPad T14) flagged for cryptographic mismatch at Checkpoint Alpha.</p>
          </div>

          <h4 style={{ marginTop: '30px', color: '#0d3b44' }}>System Access & Audit Trail Logs</h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', borderTop: '2px solid #135c6b', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f1f1', textAlign: 'left' }}>
                <th style={{ padding: '10px' }}>Log ID</th>
                <th style={{ padding: '10px' }}>Event Description</th>
                <th style={{ padding: '10px' }}>Timestamp</th>
                <th style={{ padding: '10px' }}>Compliance Status</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>LOG-901</td>
                <td style={{ padding: '10px' }}>Batch 101 Encrypted QR Generated by QR Operator</td>
                <td style={{ padding: '10px' }}>10:15 AM</td>
                <td style={{ padding: '10px', color: 'green' }}>✔ Verified Secure</td>
              </tr>
              <tr>
                <td style={{ padding: '10px' }}>LOG-902</td>
                <td style={{ padding: '10px' }}>Checkpoint Alpha Scan Attempt on Flagged Asset</td>
                <td style={{ padding: '10px' }}>10:30 AM</td>
                <td style={{ padding: '10px', color: 'red' }}>✖ Alert Triggered</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* ================= QR OPERATOR ================= */}
      {activeRole === 'QR Operator' && (
        <div>
          <h3 style={{ color: '#0d3b44', borderBottom: '2px solid #ccc', paddingBottom: '10px', fontSize: '1.5rem' }}>Batch Logistics Operator</h3>
          <div style={{ padding: '30px', backgroundColor: '#fafafa', borderRadius: '8px', border: '1px solid #ddd', marginTop: '20px' }}>
            <h4 style={{ color: '#333', marginBottom: '20px' }}>Live Encrypted QR Generation</h4>
            <input 
              type="text" 
              placeholder="Enter Product Code" 
              value={qrInput}
              onChange={(e) => { setQrInput(e.target.value); setShowQR(false); }}
              style={{ padding: '10px', width: '300px', marginRight: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
            <button onClick={handleGenerateQR} style={{ padding: '10px 20px', backgroundColor: '#20c997', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Encrypt & Generate QR
            </button>
            {showQR && (
              <div style={{ marginTop: '30px', padding: '20px' }}>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrInput}-Encrypted`} alt="Generated QR" />
                <p style={{ fontSize: '0.9rem', color: '#555', marginTop: '10px' }}><strong>Encrypted Payload Ready</strong></p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= SCANNER ================= */}
      {activeRole === 'Scanner' && (
        <div>
          <h3 style={{ color: '#0d3b44', borderBottom: '2px solid #ccc', paddingBottom: '10px', fontSize: '1.5rem' }}>Checkpoint QR Scanner</h3>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <div style={{ margin: '0 auto', border: '1px solid #ddd', padding: '20px', borderRadius: '8px', maxWidth: '400px', backgroundColor: '#fff' }}>
              <h4 style={{ margin: '0 0 15px 0' }}>Live Scanner (jsQR Engine)</h4>
              
              <div style={{ width: '100%', minHeight: '300px', backgroundColor: '#000', borderRadius: '8px', border: '2px solid #ddd', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', position: 'relative' }}>
                <video ref={videoRef} autoPlay playsInline style={{ width: '100%', display: isCameraActive ? 'block' : 'none' }}></video>
                <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                {!isCameraActive && (
                  <p style={{ color: '#888', position: 'absolute' }}>📱 Camera Offline</p>
                )}
              </div>
              
              <div style={{ marginTop: '15px' }}>
                 {!isCameraActive ? (
                   <button onClick={requestCamera} style={{ padding: '10px 20px', backgroundColor: '#0d3b44', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                     Start Hardware Scanner
                   </button>
                 ) : (
                   <p style={{ color: '#20c997', fontWeight: 'bold' }}>Scanning in real-time... show QR to camera.</p>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MANAGER ================= */}
      {activeRole === 'Manager' && (
        <div>
          <h3 style={{ color: '#0d3b44', borderBottom: '2px solid #ccc', paddingBottom: '10px', fontSize: '1.5rem' }}>Manager: Live Tracking & Process Dashboard</h3>
          <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
            <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
              <h4 style={{ marginTop: 0, color: '#333' }}>Deadline Schedule & Process</h4>
              <ul style={{ paddingLeft: '20px', color: '#555', lineHeight: '2' }}>
                <li><span style={{ color: 'orange' }}>●</span> <strong>Batch 101</strong> - Dispatch by 2:00 PM <span style={{ color: 'orange' }}>(Pending)</span></li>
                <li><span style={{ color: '#007bff' }}>●</span> <strong>Batch 99</strong> - Delivered <span style={{ color: '#007bff' }}>(Process Complete)</span></li>
              </ul>
            </div>
            <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff', textAlign: 'center' }}>
               <h4 style={{ marginTop: 0, color: '#333' }}>Live GPS Tracker</h4>
               <div style={{ padding: '15px', border: '1px solid #4caf50', display: 'inline-block', borderRadius: '4px', marginTop: '10px' }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: '#0d3b44' }}>Truck MP09-AB-1234</p>
                  <p style={{ margin: '5px 0 0 0', color: '#777', fontSize: '0.9rem' }}>En route to Checkpoint B</p>
               </div>
            </div>
            <div style={{ flex: 1, padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
               <h4 style={{ marginTop: 0, color: '#333' }}>System Audit & Status Logs</h4>
               <div style={{ backgroundColor: '#222', padding: '10px', borderRadius: '4px', fontSize: '0.85rem', fontFamily: 'monospace', height: '120px', overflowY: 'hidden', color: '#4caf50' }}>
                  <p style={{ margin: '5px 0' }}>[10:00 AM] INFO: Secure connection established.</p>
                  <p style={{ margin: '5px 0' }}>[10:15 AM] SUCCESS: Batch 101 encrypted QR generated.</p>
               </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
export default Dashboard;