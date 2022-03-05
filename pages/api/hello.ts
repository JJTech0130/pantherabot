// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../utils/supabaseClient'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    let { data, error, status } = await supabase.from('test').select(`name`).eq('id', 1).single();
    console.log("test");
    res.status(200).json({ name: data.name });
}
