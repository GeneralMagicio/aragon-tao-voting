import type { NextApiRequest, NextApiResponse } from 'next'
import { IssueGenerator } from '../../models/issueGenerator'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'POST') {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
  const data = req.body
  const requiredParameters = [
    'imageInfo',
    'proposalInfo',
    'taoVoting',
    'disputableVoting',
  ]
  if (!requiredParameters.every((item) => data.hasOwnProperty(item))) {
    res.status(406).end('The proposal submission data is not complete.')
  }
  const issueGenerator = new IssueGenerator(
    data.imageInfo,
    data.proposalInfo,
    data.taoVoting,
    data.disputableVoting
  )
  const response = await issueGenerator.createIssue()
  const result = await response.json()
  res.status(200).json({ data: { issueUrl: result.html_url } })
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
}
