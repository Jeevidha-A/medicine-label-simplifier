import os

from dotenv import load_dotenv
from fastapi import HTTPException, Request
from clerk_backend_api import Clerk
from clerk_backend_api.security.types import AuthenticateRequestOptions


load_dotenv()

CLERK_SECRET_KEY = os.getenv("CLERK_SECRET_KEY")

if not CLERK_SECRET_KEY:
    raise RuntimeError(
        "CLERK_SECRET_KEY is missing from backend/.env"
    )


clerk = Clerk(
    bearer_auth=CLERK_SECRET_KEY
)


AUTHORIZED_PARTIES = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173"
    ).split(",")
    if origin.strip()
]


def get_current_user(request: Request) -> str:

    try:

        state = clerk.authenticate_request(
            request,
            AuthenticateRequestOptions(
                authorized_parties=AUTHORIZED_PARTIES
            )
        )

        if not state.is_signed_in:
            raise HTTPException(
                status_code=401,
                detail="User is not authenticated."
            )

        payload = state.payload or {}

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="User ID was not found in the Clerk token."
            )

        return user_id

    except HTTPException:
        raise

    except Exception as exc:

        print("Clerk authentication error:", exc)

        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {exc}"
        )