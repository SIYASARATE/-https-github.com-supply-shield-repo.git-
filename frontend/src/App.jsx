import React, { useState } from 'react';
import Dashboard from './Dashboard';
import warehouseImg from './Teal-Tinted Modern Warehouse Interior.png';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeRole, setActiveRole] = useState('');
  const [pin, setPin] = useState('');
  const [loggedInUserName, setLoggedInUserName] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (!activeRole) {
      alert("Please select a Clearance Level first.");
      return;
    }
    if (!pin) {
      alert("Please enter your 4-Digit Secure PIN.");
      return;
    }
    
    // 1. Admin Master Login (Siya - PIN: 1234)
    if (activeRole === 'Admin') {
      if (pin === '1234') { 
        setIsAuthenticated(true);
        setLoggedInUserName('Siya Sarate (Admin)');
      } else {
        alert("❌ ERROR: Incorrect Admin Master PIN!");
      }
      return;
    }

    // 2. Employee Login Verification (Unique Employee 4-Digit PIN)
    const savedUsers = JSON.parse(localStorage.getItem('appUsers')) || {};
    const employeeData = savedUsers[pin];

    if (employeeData && employeeData.role === activeRole) {
      setIsAuthenticated(true);
      setLoggedInUserName(`${employeeData.name} (${employeeData.role})`);
    } else if (employeeData && employeeData.role !== activeRole) {
      alert(`❌ ROLE MISMATCH! Ye PIN ek ${employeeData.role} ka hai. Kripya sahi Clearance Level select karein.`);
    } else {
      alert("❌ INCORRECT PIN! Authentication Failed. No such employee found.");
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveRole('');
    setPin('');
    setLoggedInUserName('');
  };

 
      if (!isAuthenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#0d212b',
        backgroundImage: `linear-gradient(rgba(13, 33, 43, 0.8), rgba(13, 33, 43, 0.8)), url(${warehouseImg})`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#fff', fontSize: '3rem', margin: '0 0 10px 0', letterSpacing: '1.5px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>SupplyShield</h1>
          <p style={{ color: '#4ea8de', fontSize: '1.2rem', margin: 0, fontWeight: '500', letterSpacing: '0.5px' }}>Zero-Trust Authentication Gateway</p>
        </div>
        
        <div style={{ backgroundColor: 'rgba(25, 45, 58, 0.8)', backdropFilter: 'blur(10px)', padding: '40px 30px', borderRadius: '16px', border: '1px solid rgba(78, 168, 222, 0.4)', boxShadow: '0 15px 35px rgba(0, 0, 0, 0.6)', width: '100%', maxWidth: '380px', textAlign: 'center' }}>
          <h3 style={{ color: '#fff', marginTop: 0, marginBottom: '25px', fontSize: '1.3rem', fontWeight: '600' }}>Command Center Login</h3>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <select 
              value={activeRole} 
              onChange={(e) => setActiveRole(e.target.value)} 
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', fontSize: '1rem', outline: 'none', cursor: 'pointer', backgroundColor: '#ffffff', color: '#333', fontWeight: '500' }}
            >
              <option value="">-- Select Clearance Level --</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="QR Operator">QR Operator</option>
              <option value="Auditor">Auditor</option>
              <option value="Scanner">Scanner</option>
            </select>
            
            <input 
              type="password" 
              placeholder="Enter 4-Digit Secure PIN" 
              maxLength="4"
              value={pin} 
              onChange={(e) => setPin(e.target.value)} 
              style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', outline: 'none', boxSizing: 'border-box', fontSize: '1rem', backgroundColor: '#ffffff', color: '#333', textAlign: 'center', letterSpacing: '3px', fontWeight: 'bold' }} 
            />
            
            <button type="submit" style={{ padding: '14px', background: 'linear-gradient(135deg, #20c997 0%, #17a2b8 100%)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '10px', boxShadow: '0 4px 15px rgba(32, 201, 151,.4)' }}>
              Authenticate System
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0d3b44', color: 'white', padding: '15px 20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>SupplyShield | Welcome, {loggedInUserName}</h2>
        <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
      </header>
      <main style={{ padding: '20px' }}>
        <Dashboard activeRole={activeRole} />
      </main>
    </div>
  );
}
export default App;