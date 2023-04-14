/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  env: {
    AUTH_URL: "localhost:8080",
    CHAT_URL: "localhost:8000/api/v1",
    NOTIFICATIONS_URL: "localhost:1232",
  },
};
