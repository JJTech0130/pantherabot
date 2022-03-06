import type { NextApiRequest, NextApiResponse } from 'next'

export type Middleware = (req: NextApiRequest, res: NextApiResponse, next: any) => any;

// Shim to run Express middleware.
export default function runMiddleware(req: NextApiRequest, res: NextApiResponse, middleware: Middleware) {
    return new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result)
        }
        return resolve(result)
      })
    })
}