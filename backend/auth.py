import os

from dotenv import load_dotenv
from fastapi import HTTPException, Request
from clerk_backend_api import authenticate_request, AuthenticateRequestOptions


load_dotenv()


CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")
CLERK_JWT_KEY = os.getenv("CLERK_JWT_KEY")


if not CLERK_SECRET_KEY:
    raise RuntimeError(
        "CLERK_SECRET_KEY is missing from backend/.env"
    )


def get_current_user(request: Request) -> str:
    try:
        state = authenticate_request(
            request,
            AuthenticateRequestOptions(
                secret_key=CLERK_SECRET_KEY,
                jwt_key=CLERK_JWT_KEY,
                authorized_parties=[
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                ],
                accepts_token=["session_token"],
            ),
        )

    except Exception as exc:
        print("Clerk authentication error:", exc)

        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {exc}",
        )

    if not state.is_signed_in:
        reason = (
            state.reason.name
            if state.reason
            else "User is not authenticated."
        )

        raise HTTPException(
            status_code=401,
            detail=reason,
        )

    payload = state.payload or {}

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="User ID was not found in the Clerk token.",
        )

    return user_id