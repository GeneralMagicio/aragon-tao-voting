import { TaoVoting } from './taoVoting'
import { saveProposalDB } from '../database/utils'
import { IImageInfo, IProposalInfo, IProposalDBSchema } from '../types/proposal'
import { ITaoVoting, IDisputableVoting } from '../types/taoVoting'

export class IssueGenerator {
  imageInfo: IImageInfo
  proposalInfo: IProposalInfo
  taoVoting: ITaoVoting
  disputableVoting: IDisputableVoting
  constructor(
    imageInfo: IImageInfo,
    proposalInfo: IProposalInfo,
    taoVoting: ITaoVoting,
    disputableVoting: IDisputableVoting
  ) {
    this.imageInfo = imageInfo
    this.proposalInfo = proposalInfo
    this.taoVoting = taoVoting
    this.disputableVoting = disputableVoting
  }

  private async saveProposal(issueNumber: string) {
    const proposalSchema: IProposalDBSchema = {
      issueNumber: issueNumber,
      proposalInfo: this.proposalInfo,
      taoVoting: this.taoVoting,
      disputableVoting: this.disputableVoting,
    }
    saveProposalDB(proposalSchema)
  }

  private async formatOutputIssue(issueNumber: string, formatOutputIssue = '') {
    const taoVoting = new TaoVoting(this.taoVoting, this.disputableVoting)
    const taoVotingOutput = await taoVoting.getData()
    const taoVotingInput = taoVoting.taoVoting
    const disputableVotingInput = taoVoting.disputableVoting
    const deployedURL = process.env.DEPLOYED_URL || ''

    const { timeVote, timeReview, timeExecute } = taoVotingOutput.timelineData
    const { proposalDeposit, challengeDeposit, setlementPeriod } =
      taoVotingOutput.disputableVoting
    const outputIssue = `
# ${this.proposalInfo.title}
${this.proposalInfo.strategy}

## Tao Voting Timeline From Proposal To Execution
![](${formatOutputIssue})
>This shows how the timeline stacks up for yes/no time based votes that can change the configuration after launch.

##  Tao Voting
| Parameter               | Value                                          |
| ----------------------- | ---------------------------------------------- |
| Support Required        | ${100 * taoVotingInput.supportRequired}%       |
| Minimum Quorum          | ${100 * taoVotingInput.minimumQuorum}%         |
| Vote Duration           | ${taoVotingInput.voteDuration}                 |
| Delegated Voting Period | ${taoVotingInput.delegatedVotingPeriod} day(s) |
| Quiet Ending Period     | ${taoVotingInput.quietEndingPeriod}  day(s)    |
| Quiet Ending Extension  | ${taoVotingInput.quietEndingExtension}  day(s) |
| Execution Delay         | ${taoVotingInput.executionDelay}  day(s)       |

### Timeline Data
|# of Quiet Ending Extensions        | No Extensions                     | With 1 Extension                   | With 2 Extensions                   |
| ---------------------------------- | --------------------------------- | ---------------------------------- | ----------------------------------- |
| Time to Vote on Proposals          | ${timeVote.noExtension} day(s)    | ${
      timeVote.oneExtension
    } day(s)    | ${timeVote.twoExtensions} day(s)    |
| Time to Review a Delegates Vote    | ${timeReview.noExtension} day(s)  | ${
      timeReview.oneExtension
    } day(s)  | ${timeReview.twoExtensions} day(s)  |
| Time to Execute a Passing Proposal | ${timeExecute.noExtension} day(s) | ${
      timeExecute.oneExtension
    } day(s) | ${timeExecute.twoExtensions} day(s) |

##  Disputable Voting
| Parameter         | Value                                                                         |
| ----------------- | ----------------------------------------------------------------------------- |
| Proposal Deposit  | ${disputableVotingInput.proposalDeposit} ANT ($${
      proposalDeposit.valueUsd
    })   |
| Challenge Deposit | ${disputableVotingInput.challengeDeposit} ANT ($${
      challengeDeposit.valueUsd
    }) |
| Settlement Period | ${setlementPeriod} day(s)           |

### [FORK THIS PROPOSAL](${deployedURL}/import/${issueNumber}) (link)
`
    return outputIssue
  }

  private async uploadImageImgur() {
    if (this.imageInfo.image === '') {
      return ''
    }
    const imgurResponse = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        Authorization: process.env.IMGUR_CLIENT_ID || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: this.imageInfo.image,
        type: this.imageInfo.type,
      }),
    })
    const jsonOutput = await imgurResponse.json()
    return jsonOutput.data.link
  }

  public async createIssue() {
    const OWNER = process.env.GITHUB_OWNER || ''
    const REPO = process.env.GITHUB_REPO || ''
    const response = await fetch(
      `https://api.github.com/search/issues?q=repo:${OWNER}/${REPO}`
    )
    const repoIssues = await response.json()
    const issueNumber = (repoIssues.total_count + 1).toString()
    await this.saveProposal(issueNumber)
    const imageUrl = await this.uploadImageImgur()

    const reponse = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/issues`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: process.env.GITHUB_AUTH || '',
        },
        body: JSON.stringify({
          title: this.proposalInfo.title,
          body: (
            await this.formatOutputIssue(issueNumber, imageUrl)
          ).toString(),
        }),
      }
    )
    return reponse
  }
}
