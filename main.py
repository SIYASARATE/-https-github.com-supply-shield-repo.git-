import hashlib
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from cryptography.fernet import Fernet
from passlib.context import CryptContext
from pydantic import BaseModel
import os
import qrcode
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI(title="SupplyShield Backend")

# CYBER DEFENSE: Strict CORS Policy
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# CYBER DEFENSE: Encryption setup
SECRET_ENCRYPTION_KEY = Fernet.generate_key()
cipher_suite = Fernet(SECRET_ENCRYPTION_KEY)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ----------------------------------------------------------------
# PYDANTIC MODELS (Data Structures for API Requests)
# ----------------------------------------------------------------
class LoginRequest(BaseModel):
    emp_id: str
    pin: str

class ScanRequest(BaseModel):
    encrypted_qr: str
    shipment_id: str
    checkpoint_id: str
    scanned_by: str

@app.get("/")
def home():
    return {
        "Project": "SupplyShield", 
        "Message": "Backend is running fine!",
    }

@app.get("/generate-qr/")
def generate_qr(product_code: str):
    # 1. Create the Company Hash Seal (SHA-256 Digital Signature)
    company_secret = "SUPPLYSHIELD-IPS-ACADEMY-2026"
    data_to_seal = f"{product_code}-{company_secret}"
    hash_seal = hashlib.sha256(data_to_seal.encode()).hexdigest()
    
    # 2. Package the product code and the seal together
    secure_payload = f"{product_code}::SEAL::{hash_seal}"
    
    # 3. Encrypt the entire package so the QR code hides the plain text
    encrypted_qr_data = cipher_suite.encrypt(secure_payload.encode()).decode()
    
    # 4. Generate the QR code using the encrypted cipher-text
    qr = qrcode.make(encrypted_qr_data)
    file_name = f"{product_code}_secure.png"
    qr.save(file_name)
    
    return FileResponse(file_name)

# ----------------------------------------------------------------
# ROUTE 1: Naya data save karne ke liye (Write API)
# ----------------------------------------------------------------
@app.get("/add-product/")
def add_product(product_code: str):
    try:
        # CYBER TASK: Encrypt the product code into cipher-text
        encrypted_payload = cipher_suite.encrypt(product_code.encode()).decode()
        
        new_product = {
            "product_code": product_code,
            "qr_reference": encrypted_payload
        }
        response = supabase.table("products").insert(new_product).execute()
        return {
            "message": "Product successfully saved to Cloud!",
            "database_entry": response.data
        }
    except Exception as e:
        return {
            "error_alert": "Database ne data reject kar diya!",
            "exact_reason": str(e)
        }

# ----------------------------------------------------------------
# ROUTE 2: Saara data wapas lane ke liye (Read API)
# ----------------------------------------------------------------
@app.get("/get-products/")
def get_all_products():
    try:
        response = supabase.table("products").select("*").execute()
        return {
            "status": "success",
            "total_items": len(response.data),
            "data": response.data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": "Data lane me problem aayi",
            "exact_reason": str(e)
        }

# ----------------------------------------------------------------
# ROUTE 3: 110 -> 100 Discrepancy Engine & Secure Verification
# ----------------------------------------------------------------
@app.post("/verify-scan/")
def verify_qr_scan(req: ScanRequest):
    try:
        # 1. Cryptographic Decryption & Seal Verification
        decrypted_payload = cipher_suite.decrypt(req.encrypted_qr.encode()).decode()
        if "::SEAL::" not in decrypted_payload:
            raise ValueError("Missing Cryptographic Seal")
            
        extracted_code, extracted_seal = decrypted_payload.split("::SEAL::")
        company_secret = "SUPPLYSHIELD-IPS-ACADEMY-2026"
        expected_hash = hashlib.sha256(f"{extracted_code}-{company_secret}".encode()).hexdigest()
        
        if extracted_seal != expected_hash:
            raise ValueError("Seal mismatch! Counterfeit detected.")
            
        # 2. Duplicate Scan Prevention
        existing_scan = supabase.table("checkpoint_scans").select("*")\
            .eq("product_code", extracted_code).eq("checkpoint_id", req.checkpoint_id).execute()
        
        if existing_scan.data:
            raise HTTPException(status_code=400, detail=f"Duplicate Scan Alert: {extracted_code} already verified.")

        # 3. Log the Unique Scan
        new_scan = {
            "shipment_id": req.shipment_id,
            "product_code": extracted_code,
            "checkpoint_id": req.checkpoint_id,
            "scanned_by": req.scanned_by,
            "result": "Verified"
        }
        supabase.table("checkpoint_scans").insert(new_scan).execute()

        # 4. Calculate Discrepancy (110 -> 100 Logic)
        scans_response = supabase.table("checkpoint_scans").select("*").eq("shipment_id", req.shipment_id).execute()
        verified_count = len(scans_response.data)

        shipment_response = supabase.table("shipments").select("expected_quantity").eq("id", req.shipment_id).execute()
        expected_qty = shipment_response.data[0].get("expected_quantity") if shipment_response.data else 0

        discrepancy = expected_qty - verified_count

        return {
            "status": "Verified Unique Scan",
            "product_code": extracted_code,
            "verified_count": verified_count,
            "expected_quantity": expected_qty,
            "discrepancy": discrepancy,
            "alert": "SHORTAGE DETECTED" if discrepancy > 0 else "ALL ITEMS VERIFIED"
        }
        
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or Counterfeit QR Signature")
    
# ----------------------------------------------------------------
# ROUTE 4: AUDITOR TASK - System Integrity & Cryptographic Audit
# ----------------------------------------------------------------
@app.get("/audit-integrity/")
def audit_database_integrity():
    try:
        # 1. Fetch all records from the cloud database
        response = supabase.table("products").select("*").execute()
        records = response.data
        
        audit_results = []
        tampered_count = 0
        
        # 2. Check every single record for cryptographic tampering
        for item in records:
            p_code = item.get("product_code")
            encrypted_ref = item.get("qr_reference")
            
            status = "SECURE"
            
            try:
                # Decrypt the qr_reference saved in the database
                decrypted_code = cipher_suite.decrypt(encrypted_ref.encode()).decode()
                
                # If a hacker changed the plain text 'product_code' but couldn't forge the encryption
                if decrypted_code != p_code:
                    status = "TAMPERED - Data Mismatch Detected"
                    tampered_count += 1
            except Exception:
                # If a hacker pasted random text into the qr_reference column
                status = "TAMPERED - Cryptographic Seal Broken"
                tampered_count += 1
                
            audit_results.append({
                "product": p_code,
                "integrity_status": status
            })
            
        return {
            "message": "Cryptographic Audit Complete",
            "total_records_scanned": len(records),
            "security_breaches_found": tampered_count,
            "audit_report": audit_results
        }
    except Exception as e:
        return {"error": "Audit execution failed", "details": str(e)}
    
# ----------------------------------------------------------------
# ROUTE 5: AUTHENTICATION & RBAC (Secure Login)
# ----------------------------------------------------------------
@app.post("/login/")
def secure_login(req: LoginRequest):
    try:
        # 1. Supabase se user dhoondho
        response = supabase.table("users").select("*").eq("emp_id", req.emp_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=401, detail="User not found in system")
            
        user_record = response.data[0]
        stored_hashed_pin = user_record.get("secure_pin") 
        
        # 2. Cryptographic Check
        is_valid = pwd_context.verify(req.pin, stored_hashed_pin)
        
        if not is_valid:
            raise HTTPException(status_code=401, detail="Cryptographic PIN Mismatch. Access Denied.")
            
        # 3. Success
        return {
            "status": "Success",
            "message": "Authentication Verified",
            "user_data": {
                "name": user_record.get("name"),
                "role": user_record.get("role")
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ----------------------------------------------------------------
# UTILITY ROUTE: Generate Bcrypt Hash for "Admin_Key1001"
# ----------------------------------------------------------------
@app.get("/setup-hash/")
def get_admin_hash():
    # Visit http://127.0.0.1:8000/setup-hash/ in your browser to get the string for Supabase
    hashed_password = pwd_context.hash("Admin_Key1001")
    return {"admin_password_hash": hashed_password, "instruction": "Copy this hash and paste it into the secure_pin column for the Admin user in Supabase."}

