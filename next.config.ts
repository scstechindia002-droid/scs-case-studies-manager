/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  env: {
    DBURL: "mongodb+srv://ravikumardhotre:NVUj9j41nKvI0OKa@cluster0.ncb3x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  },
}

module.exports = nextConfig