import type { NextApiRequest, NextApiResponse } from 'next'
import Proposal from '../../../database/proposalSchema'
import { IProposalDBSchema } from '../../../types/proposal'
import mongoose from 'mongoose'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method != 'GET') {
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }

  const { issueNumber } = req.query
  await mongoose.connect(process.env.DB_CONNECTION || '')

  Proposal.findOne(
    { issueNumber: issueNumber?.toString() },
    function (err: Error, proposal: IProposalDBSchema) {
      if (err || proposal === null) {
        console.log(err)
        res.status(406).end('There is no proposal in the database with the provided issue number.')
      } else {
        const { issueNumber, proposalInfo, taoVoting, disputableVoting } =
          proposal
        res.status(200).json({
          data: {
            issueNumber,
            proposalInfo,
            taoVoting,
            disputableVoting,
          },
        })
      }
    }
  )
}
