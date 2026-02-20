import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT || 4000,
  frontend_url: process.env.FRONTEND_URL || "http://localhost:3000",
  node_env: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER!,
    pass: process.env.DB_PASS!,
    name: process.env.DB_NAME!
  },
  s3: {
    bucket_name: process.env.S3_BUCKET_NAME,
    api_endpoint: process.env.S3_API_ENDPOINT,
    location: process.env.S3_LOCATION,
    user_api_token: process.env.S3_USER_API_TOKEN,
    access_key_id: process.env.S3_ACCESS_KEY_ID,
    secret_access_key: process.env.S3_SECRET_ACCESS_KEY
  },
  admin:{
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  }
};
