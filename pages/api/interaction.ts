import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from "../../utils/supabaseClient"
import { verifyKey, InteractionType, InteractionResponseType } from "discord-interactions"
import runMiddleware from "../../middleware/middleware"
import bodyParser from "body-parser"

export const config = {
  api: {
    bodyParser: false,
  },
}

let DISCORD_PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY
let DEBUG: boolean = process.env.DEBUG === "true"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let verified: boolean = false // Assume that the request is not verified

  // Parse the body, as well as verifying the signature
  await runMiddleware(req, res, bodyParser.json( { verify: (req: NextApiRequest, res: NextApiResponse, buf: Buffer) => {
    if (DISCORD_PUBLIC_KEY) { // Ony verify if the public key is set
      verified = verifyKey(
        buf,
        req.headers['x-signature-ed25519'] as string,
        req.headers['x-signature-timestamp'] as string,
        DISCORD_PUBLIC_KEY
      )
    } else if (DEBUG) {
      console.warn("Request not verified, because the public key is not set. DEBUG mode is on, so verifying it anyway.")
      verified = true
    }
  }}))

  // If the signature is not verified, return an error
  if (!verified) {
    console.warn("Signature verification failed")
    return res.status(401).end('Bad request signature')
  }

  if (req.body.type === InteractionType.PING) {
    res.status(200).json({
      type: InteractionResponseType.PONG,
    })
  } else {
    res.status(400).json(req.body)
  }
}