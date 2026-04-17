# ═══════════════════════════════════════════════════════
#                     SERVER ENV
# ═══════════════════════════════════════════════════════

# Server port
PORT=9000

# MongoDB Atlas connection string
# Format: mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?appName=<appName>
DB_URL=mongodb+srv://<db_user>:<db_password>@<cluster>.mongodb.net/<db_name>?appName=<appName>

# Environment: development | production
NODE_ENV=development

# Allowed frontend origin (used in CORS config)
FRONTEND_PATH=https://your-frontend.vercel.app

# ── JWT Access Token ─────────────────────────────────────
# Generate secret: node -e "require('crypto').randomBytes(64).toString('hex')"
ACCESS_TOKEN_SECRET_KEY=your_access_token_secret_key_here
ACCESS_TOKEN_EXPIRY_TIME=15m

# ── JWT Refresh Token ────────────────────────────────────
REFRESH_TOKEN_SECRET_KEY=your_refresh_token_secret_key_here
REFRESH_TOKEN_EXPIRY_TIME=7d

# ── Google OAuth ─────────────────────────────────────────
# Get from: https://console.cloud.google.com → APIs & Services → Credentials
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# ── Redis ────────────────────────────────────────────────
# Format: redis://default:<password>@<host>:<port>
REDIS_URL=redis://default:<password>@<host>:<port>


# ═══════════════════════════════════════════════════════
#                     CLIENT ENV
#        All variables must be prefixed with VITE_
# ═══════════════════════════════════════════════════════

# Backend base URL — switch between local and deployed
VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
# VITE_API_BASE_URL=http://localhost:9000/api/v1

# ── Google OAuth ─────────────────────────────────────────
# Must match GOOGLE_CLIENT_ID in server env above
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id