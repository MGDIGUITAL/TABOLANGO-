export async function GET() {
  return new Response('google-site-verification: google11fdd4e712c03d13.html', {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
