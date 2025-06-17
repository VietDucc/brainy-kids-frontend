/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["picsum.photos", "www.example.com","i3.ytimg.com", "th.bing.com", "images.unsplash.com", "imgur.com",
      "hoanghamobile.com", "cdn.pixabay.com", "images.clerk.dev","s4-media1.study4.com", "i1-vnexpress.vnecdn.net", 
      "ibtinc.com", "www.elcom.com.vn", "tapchibitcoin.io","cdn2.tuoitre.vn", "giadinh.mediacdn.vn","www.symmetryelectronics.com",
    "www.pyramid-healthcare.com","www.unesco.org","thesocialmediamonthly.com"],
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
