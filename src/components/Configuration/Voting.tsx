import { useParams } from '../../hooks/useParams'
import { useTaoVoting } from '../../hooks/useTaoVoting'
import TaoVotingBar from './Chart/TaoVotingBar'
import { SideBar } from './SideBar'
import { Params } from './SideBar/Params'
import { DisputableVoating } from './DisputableVoating'
import Link from 'next/link'
import { ChartToogle } from './Chart/ChartToogle'
import ChartContainer from './Chart/ChartContainer'
import toast, { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'

export function Voting() {
  const barChart = useTaoVoting()
  const {
    supportRequired,
    minimumQuorum,
    voteDuration,
    delegatedVotingPeriod,
    quietEndingPeriod,
    quietEndingExtension,
    executionDelay,
    submitProposal,
    proposalDeposit,
    challengeDeposit,
    settlementPeriod,
  } = useParams()

  const taoInputs = [
    {
      name: 'supportRequired',
      value: supportRequired,
      param: 'Support Required',
      link: 'https://forum.aragon.org/t/tao-voting-support-required/3663',
      placeholder: '%',
      tooltipText:
        'The percent of YES votes relative to NO votes needed to pass this proposal.',
      interval: { min: 50, max: 100 },
    },
    {
      name: 'minimumQuorum',
      value: minimumQuorum,
      param: 'Minimum Quorum',
      link: 'https://forum.aragon.org/t/tao-voting-minimum-quorum/3664',
      placeholder: '%',
      tooltipText:
        'The percent of all tokens that must vote YES on a proposal in order for it to be valid.',
      interval: { min: 0 },
    },
    {
      name: 'voteDuration',
      value: voteDuration,
      param: 'Vote Duration',
      link: 'https://forum.aragon.org/t/tao-voting-vote-duration/3665',
      placeholder: 'days',
      tooltipText: 'The amount of time a proposal is eligible to be voted on.',
    },
    {
      name: 'delegatedVotingPeriod',
      value: delegatedVotingPeriod,
      param: 'Delegated Voting Period',
      link: 'https://forum.aragon.org/t/tao-voting-delegated-voting-period/3666',
      placeholder: 'days',
      tooltipText:
        'The amount of time within the Vote Duration that delegates are permitted to vote on a proposal.',
    },
    {
      name: 'quietEndingPeriod',
      value: quietEndingPeriod,
      param: 'Quiet Ending Period',
      link: 'https://forum.aragon.org/t/tao-voting-quiet-ending-period-and-quiet-ending-extension/3667',
      placeholder: 'days',
      tooltipText:
        'If the voting outcome changes during this time the Quiet Ending Extension will trigger, extending the Vote Duration.',
    },
    {
      name: 'quietEndingExtension',
      value: quietEndingExtension,
      param: 'Quiet Ending Extension',
      link: 'https://forum.aragon.org/t/tao-voting-quiet-ending-period-and-quiet-ending-extension/3667',
      placeholder: 'days',
      tooltipText:
        'The amount of time added to the Vote Duration resulting from the vote outcome changing during the Quiet Ending.',
    },
    {
      name: 'executionDelay',
      value: executionDelay,
      param: 'Execution Delay',
      link: 'https://forum.aragon.org/t/tao-voting-execution-delay/3668',
      placeholder: 'days',
      tooltipText:
        'The amount of time after a vote passes before the proposed action is executed',
    },
  ]

  const disputableInputs = [
    {
      name: 'proposalDeposit',
      value: proposalDeposit,
      param: 'Proposal Deposit',
      link: 'https://forum.aragon.org/t/deposit-and-challenge-deposit/3669',
      placeholder: 'ANT',
      tooltipText:
        'Proposal creators must lock a set amount of funds as the collateral required to create a proposal.',
    },
    {
      name: 'challengeDeposit',
      value: challengeDeposit,
      param: 'Challenge Deposit',
      link: 'https://forum.aragon.org/t/deposit-and-challenge-deposit/3669',
      placeholder: 'ANT',
      tooltipText:
        'If an individual believes that a certain proposal is malicious, contains an error, or is not in alignment with the Community Covenant, they can challenge the proposal',
    },
    {
      name: 'settlementPeriod',
      value: settlementPeriod,
      param: 'Settlement Period',
      link: 'https://forum.aragon.org/t/settlement-period/3670',
      placeholder: 'days',
      tooltipText:
        'Once challenged, the proposal creator has a set amount of time, the “Settlement Period” to dispute the challenge by paying dispute fees and raising the issue to court',
    },
  ]

  useEffect(() => {
    if (barChart.error === true) {
      toast('Something went wrong!', {
        duration: 3000,
        position: 'bottom-center',
        style: {
          background: '#3164FA',
          color: '#ffff',
        },
        className: 'font-over font-bold',
        ariaProps: {
          role: 'status',
          'aria-live': 'polite',
        },
      })
    }
  }, [barChart.error])

  return (
    <>
      <div className="min-h-screen h-full bg-dash">
        <div className="flex flex-col md:flex-row">
          <SideBar submitProposal={!submitProposal}>
            <Params title="Tao Voting" inputParams={taoInputs} />
            <Params title="Disputable Voting" inputParams={disputableInputs} />
          </SideBar>
          <div className="w-full divide-y divide-gray-100">
            <ChartContainer>
              <TaoVotingBar
                nonQuietVotingPeriod={
                  barChart.totalProposalProcess?.nonQuietVotingPeriod
                }
                quietEndingPeriod={
                  barChart.totalProposalProcess?.quietEndingPeriod
                }
                executionDelay={barChart.totalProposalProcess?.executionDelay}
                delegatedVotingPeriod={
                  barChart.delegatedVoting?.delegatedVotingPeriod
                }
                voteDuration={
                  barChart.proposalProcessWithExtension?.voteDuration
                }
                quietEndingPeriodWithExtension={
                  barChart.proposalProcessWithExtension?.quietEndingExtension
                }
                executionDelayWithExtension={
                  barChart.proposalProcessWithExtension?.executionDelay
                }
              />
            </ChartContainer>
            <div className="flex justify-center pt-16">
              <DisputableVoating />
            </div>
          </div>
          <div className="my-8 w-full md:hidden flex flex-col px-12">
            <ChartToogle />
            <Link href="/submit-proposal">
              <button className="bg-blue text-white border-2 border-transparent hover:text-blue hover:border-blue hover:border-2 hover:bg-white font-semibold py-3 px-10 rounded-lg drop-shadow-sm transition ease-in-out duration-500 w-full">
                Review Proposal
              </button>
            </Link>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
