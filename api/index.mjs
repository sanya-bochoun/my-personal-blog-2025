// api/index.mjs
import app from '../app.mjs'

export default function handler(req, res) {
  // ห่อ Express app ให้รับ req/res บน Vercel
  return app(req, res)
}
