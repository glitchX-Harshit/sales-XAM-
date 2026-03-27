import os
import ssl
import certifi
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Fix macOS Python SSL certificate issues by pointing OpenSSL to certifi universally
os.environ["SSL_CERT_FILE"] = certifi.where()
ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())

# Load environment variables
load_dotenv()

# [DEBUG LOG] Check if deepgram key was found in .env
print("Deepgram key loaded:", bool(os.getenv("DEEPGRAM_API_KEY")))

app = FastAPI(title="klyro.ai Backend", description="AI Sales Assistant API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import json
import jwt
from jwt import PyJWKClient
from pydantic import BaseModel
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from services.websocket_service import websocket_manager
from services.call_context_engine import call_context_engine

security = HTTPBearer()

# Initialize the JWKS client to fetch Supabase's public keys for ES256 verification
SUPABASE_URL = os.getenv("SUPABASE_URL", "")
JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
jwks_client = PyJWKClient(JWKS_URL, cache_keys=True)

def _verify_token(token: str) -> dict:
    """Core JWT verification using Supabase JWKS (ES256)."""
    # Strip any potential quotes
    if token.startswith('"') and token.endswith('"'):
        token = token[1:-1]
    try:
        # Fetch the correct public key from Supabase's JWKS endpoint
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["ES256"],
            options={"verify_aud": False}
        )
        return payload
    except Exception as e:
        print(f"JWT Verification failed: {str(e)}")
        raise e

def verify_supabase_jwt(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """FastAPI dependency for REST endpoint auth."""
    try:
        return _verify_token(credentials.credentials)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Security validation failed: {str(e)}")

class CallStartRequest(BaseModel):
    client_name: str
    client_industry: str
    client_role: str
    product_name: str
    call_goal: str


@app.get("/")
async def root():
    return {"message": "klyro.ai backend is running securely."}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/call/start")
async def start_call(request: CallStartRequest, user: dict = Depends(verify_supabase_jwt)):
    context_id = call_context_engine.create_context(
        client_name=request.client_name,
        client_industry=request.client_industry,
        client_role=request.client_role,
        product_name=request.product_name,
        call_goal=request.call_goal
    )
    return {"context_id": context_id, "message": "Call session initialized securely"}

@app.get("/call/context/{context_id}")
async def get_call_context(context_id: str, user: dict = Depends(verify_supabase_jwt)):
    context = call_context_engine.get_context(context_id)
    if not context:
        return {"error": "Context not found"}
    return {"context": context}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(default=None)):
    if not token:
        await websocket.close(code=1008, reason="Missing authentication token")
        return
    try:
        _verify_token(token)
    except Exception:
        await websocket.close(code=1008, reason="Invalid authentication token")
        return

    await websocket_manager.connect(websocket)
    try:
        while True:
            # Legacy text-based endpoint fallback
            data = await websocket.receive_text()
            try:
                message_data = json.loads(data)
                if hasattr(websocket_manager, 'handle_live_message'):
                    await websocket_manager.handle_live_message(message_data, websocket)
            except json.JSONDecodeError:
                pass
    except WebSocketDisconnect:
        pass
    finally:
        websocket_manager.disconnect(websocket)

@app.websocket("/ws/audio")
async def websocket_audio_endpoint(websocket: WebSocket, context_id: str | None = None, token: str = Query(default=None)):
    print(f"🔌 WS /ws/audio: context_id={context_id}, token={'present' if token else 'MISSING'}")
    if not token:
        print("❌ WebSocket rejected: No token parameter found in URL")
        await websocket.close(code=1008, reason="Missing authentication token")
        return
    try:
        _verify_token(token)
        print("✅ WebSocket token verified successfully")
    except Exception as e:
        print(f"❌ WebSocket token verification failed: {str(e)}")
        await websocket.close(code=1008, reason="Invalid authentication token")
        return

    print(f"🔌 WebSocket connection attempt to /ws/audio (context_id: {context_id})")
    await websocket_manager.connect(websocket, context_id=context_id)
    print("✅ WebSocket connected to /ws/audio")
    await websocket_manager.handle_audio_stream(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
