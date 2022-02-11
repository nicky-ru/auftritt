import { NextApiRequest, NextApiResponse } from 'next'
import { SiweMessage } from 'siwe'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req
    switch (method) {
        case 'POST':
            try {
                const { message, signature } = req.body
                const siweMessage = new SiweMessage(message)
                await siweMessage.validate(signature)
                res.json({ ok: true })
            } catch (_error) {
                res.json({ ok: false })
            }
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}

export default handler