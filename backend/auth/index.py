import json
import os
import hashlib
import hmac
import base64
import time
import psycopg2

CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Authorization",
}


def make_jwt(payload: dict) -> str:
    """Создаём простой JWT токен."""
    secret = os.environ.get("JWT_SECRET", "fallback_secret")
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).rstrip(b"=").decode()
    payload_b64 = base64.urlsafe_b64encode(json.dumps(payload).encode()).rstrip(b"=").decode()
    msg = f"{header}.{payload_b64}"
    sig = hmac.new(secret.encode(), msg.encode(), hashlib.sha256).digest()  # noqa: S324
    sig_b64 = base64.urlsafe_b64encode(sig).rstrip(b"=").decode()
    return f"{msg}.{sig_b64}"


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


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")


def get_conn():
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    return conn


def handler(event: dict, context) -> dict:
    """Авторизация и регистрация пользователей SUNVPN."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS_HEADERS, "body": ""}

    path = event.get("path", "")
    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "")

    # Поддержка path-based и action-based маршрутизации
    if path.endswith("/register"):
        action = "register"
    elif path.endswith("/login"):
        action = "login"

    # --- REGISTER ---
    if action == "register":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")
        username = body.get("username", "").strip()

        if not email or not password or not username:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Заполните все поля"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Пароль минимум 6 символов"})}

        s = get_schema()
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id FROM {s}.users WHERE email = %s OR username = %s", (email, username))
        if cur.fetchone():
            conn.close()
            return {"statusCode": 409, "headers": CORS_HEADERS, "body": json.dumps({"error": "Email или имя уже заняты"})}

        pw_hash = hash_password(password)
        cur.execute(
            f"INSERT INTO {s}.users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
            (username, email, pw_hash)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
        conn.close()

        token = make_jwt({"user_id": user_id, "exp": int(time.time()) + 86400 * 30})
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "token": token,
                "user": {"id": user_id, "email": email, "username": username}
            })
        }

    # --- LOGIN ---
    if action == "login":
        email = body.get("email", "").strip().lower()
        password = body.get("password", "")

        if not email or not password:
            return {"statusCode": 400, "headers": CORS_HEADERS, "body": json.dumps({"error": "Введите email и пароль"})}

        s = get_schema()
        conn = get_conn()
        cur = conn.cursor()
        cur.execute(f"SELECT id, username, password_hash FROM {s}.users WHERE email = %s", (email,))
        row = cur.fetchone()
        conn.close()

        if not row or row[2] != hash_password(password):
            return {"statusCode": 401, "headers": CORS_HEADERS, "body": json.dumps({"error": "Неверный email или пароль"})}

        user_id, username, _ = row
        token = make_jwt({"user_id": user_id, "exp": int(time.time()) + 86400 * 30})
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({
                "token": token,
                "user": {"id": user_id, "email": email, "username": username}
            })
        }

    return {"statusCode": 404, "headers": CORS_HEADERS, "body": json.dumps({"error": "Not found"})}