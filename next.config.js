/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/IMAGENES/**',
      },
      {
        pathname: '/hero/**',
      },
      {
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
