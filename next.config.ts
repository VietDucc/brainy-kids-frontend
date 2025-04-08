/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["picsum.photos", "www.example.com","i3.ytimg.com"],
  },
  eslint: {
    // Tắt kiểm tra ESLint khi build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Tắt kiểm tra TypeScript khi build
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
