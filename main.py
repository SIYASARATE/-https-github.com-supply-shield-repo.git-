from fastapi import FastAPI
from fastapi.responses import FileResponse
import os
import qrcode
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

app = FastAPI(title="SupplyShield Backend")

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