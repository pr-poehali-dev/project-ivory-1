import json
import os
import hashlib
import hmac
import base64
import time
import psycopg2

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
}


def verify_jwt(token: str) -> dict:
    """Проверяем JWT токен, возвращаем payload или пустой dict."""
    secret = os.environ.get("JWT_SECRET", "fallback_secret")
    parts = token.split(".")
    if len(parts) != 3:
        return {}
    msg = f"{parts[0]}.{parts[1]}"
    sig = hmac.new(secret.encode(), msg.encode(), hashlib.sha256).digest()
    expected = base64.urlsafe_b64encode(sig).rstrip(b"=").decode()
    if not hmac.compare_digest(parts[2], expected):
        return {}
    padding = 4 - len(parts[1]) % 4
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + "=" * padding))
    if payload.get("exp", 0) < time.time():
        return {}
    return payload


def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Информация о подписке пользователя SUNVPN."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    # Получаем токен из заголовка
    headers = event.get("headers", {}) or {}
    auth = headers.get("X-Authorization") or headers.get("Authorization") or ""
    token = auth.replace("Bearer ", "").strip()

    payload = verify_jwt(token)
    if not payload.get("user_id"):
        return {"statusCode": 401, "headers": CORS_HEADERS, "body": json.dumps({"error": "Unauthorized"})}

    user_id = payload["user_id"]

    s = get_schema()
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        f"SELECT plan, expires_at, active FROM {s}.subscriptions WHERE user_id = %s ORDER BY expires_at DESC LIMIT 1",
        (user_id,)
    )
    row = cur.fetchone()
    conn.close()

    if not row or not row[2]:
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"active": False, "plan": None, "expires_at": None, "days_left": None})
        }

    plan, expires_at, active = row
    now = time.time()
    expires_ts = expires_at.timestamp() if expires_at else 0
    days_left = max(0, int((expires_ts - now) / 86400))
    still_active = active and expires_ts > now

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({
            "active": still_active,
            "plan": plan,
            "expires_at": expires_at.isoformat() if expires_at else None,
            "days_left": days_left if still_active else None,
        })
    }