import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Scanner = () => {
    const [scanResult, setScanResult] = useState(null);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            qrbox: { width: 250, height: 250 },
            fps: 5,
        });

        scanner.render(
            (result) => {
                scanner.clear();
                setScanResult(result);
            },
            (error) => {
                console.warn("Scanning...", error);
            }
        );

        return () => {
            scanner.clear().catch(error => console.error("Failed to clear scanner", error));
        };
    }, []);

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h2>SupplyShield Checkpoint Scanner</h2>
            {scanResult ? (
                <div>
                    <p><strong>Scanned Payload:</strong> {scanResult}</p>
                    <button onClick={() => window.location.reload()} style={{ padding: '10px', background: '#0d3b44', color: 'white', border: 'none', borderRadius: '5px' }}>Scan Next Product</button>
                </div>
            ) : (
                <div id="reader" style={{ width: '400px', margin: 'auto' }}></div>
            )}
        </div>
    );
};

export default Scanner;