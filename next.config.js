/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  env: {
    AUTH_URL: process.env.AUTH_URL,
    CHAT_URL: process.env.CHAT_URL,
    NOTIFICATIONS_URL: process.env.NOTIFICATIONS_URL,
  },
};
