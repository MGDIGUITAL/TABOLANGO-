import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params
  const filePath = path.join(process.cwd(), 'public', 'downloads', filename)

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Archivo no encontrado', { status: 404 })
  }

  const fileBuffer = fs.readFileSync(filePath)
  const ext = path.extname(filename).toLowerCase()

  let contentType = 'application/octet-stream'
  if (ext === '.ipa') {
    contentType = 'application/octet-stream'
  } else if (ext === '.apk') {
    contentType = 'application/vnd.android.package-archive'
  } else if (ext === '.plist') {
    contentType = 'application/x-plist'
  }

  return new NextResponse(fileBuffer, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': fileBuffer.length.toString(),
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
