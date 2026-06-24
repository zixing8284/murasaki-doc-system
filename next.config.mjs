import nextMDX from '@next/mdx'

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    // Plugins are referenced by name (not imported) so that Turbopack can
    // serialize the loader options. Option objects must stay JSON-serializable.
    remarkPlugins: [
      'remark-gfm',
      ['remark-toc', { maxDepth: 3, heading: '目录' }],
      'remark-breaks',
    ],
    rehypePlugins: [
      ['rehype-pretty-code', { keepBackground: true, theme: 'dark-plus' }],
      // add id to headings
      'rehype-slug',
    ],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  // compiler: {
  //   removeConsole: process.env.NODE_ENV === 'production',
  // },
  experimental: {
    serverActions: {
      bodySizeLimit: '3mb',
    },
  }
}

export default withMDX(nextConfig)
