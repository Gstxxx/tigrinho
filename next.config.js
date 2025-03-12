/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Desabilitar o Edge Runtime para rotas que usam bcryptjs
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  serverExternalPackages: ["bcryptjs"],
};

export default nextConfig;
