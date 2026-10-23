from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import qrcode
from dotenv import load_dotenv
from supabase import create_client, Client
from passlib.context import CryptContext

load_dotenv()

app = FastAPI(title="SupplyShield Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.get("/")
def home():
    return {
        "Project": "SupplyShield", 
        "Message": "Backend is running fine!",
    }

@app.get("/generate-qr/")
def generate_qr(product_code: str):
    qr = qrcode.make(product_code)
    file_name = f"{product_code}.png"
    qr.save(file_name)
    return FileResponse(file_name)

# ----------------------------------------------------------------
# ROUTE 1: Naya data save karne ke liye (Write API)
# ----------------------------------------------------------------
@app.get("/post-product/")
def add_product(product_code: str):
    try:
        new_product = {
            "product_code": product_code,
            "qr_reference": "QR-" + product_code
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
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@app.get("/setup-hash/")
def generate_hash():
    return {"admin_password_hash": pwd_context.hash("Admin_Key1001")}
# ----------------------------------------------------------------
# DASHBOARD APIs (Frontend Integration Ke Liye)
# ----------------------------------------------------------------
@app.get("/api/stats")
def get_dashboard_stats():
    try:
        products_res = supabase.table("products").select("*", count="exact").execute()
        total_products = len(products_res.data)
        return {"products": total_products, "shipments": 14, "alerts": 1}
    except Exception as e:
        return {"products": 0, "shipments": 0, "alerts": 0, "error": str(e)}

@app.get("/api/recent-scans")
def get_recent_scans():
    return [
        {"id": "QR-8890", "item": "Server Rack A", "time": "10:15 AM", "status": "Verified"},
        {"id": "QR-8891", "item": "Network Switch", "time": "09:45 AM", "status": "Issue Flagged"},
        {"id": "QR-8892", "item": "Cooling Unit", "time": "09:30 AM", "status": "Verified"}
    ]
@app.get("/api/recent-scans")
def get_recent_scans():
    return [
        {"id": "QR-8890", "item": "Server Rack A", "time": "10:15 AM", "status": "Verified", "location": "22.7196° N, 75.8577° E (Indore Checkpoint)"},
        {"id": "QR-8891", "item": "Network Switch", "time": "09:45 AM", "status": "Issue Flagged", "location": "Transit (In-way)"},
        {"id": "QR-8892", "item": "Cooling Unit", "time": "09:30 AM", "status": "Verified", "location": "22.7244° N, 75.8720° E (Warehouse B)"}
    ]