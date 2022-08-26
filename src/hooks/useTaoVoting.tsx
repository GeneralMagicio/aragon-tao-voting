import axios from 'axios'
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react'
import { useParams } from './useParams'

type TaoVotingContextType = {
  totalProposalProcess: {
    nonQuietVotingPeriod: number
    quietEndingPeriod: number
    executionDelay: number
  }
  delegatedVoting: {
    delegatedVotingPeriod: number
  }
  proposalProcessWithExtension: {
    voteDuration: number
    quietEndingExtension: number
    executionDelay: number
  }
  proposalDeposit: {
    token: number
    valueUsd: number
  }
  challengeDeposit: {
    token: number
    valueUsd: number
  }
  setlementPeriod: number
  table?: { [key: string]: number[] }
  setContext: Dispatch<SetStateAction<TaoVotingContextType>>
  isReviewProposal: boolean
  isChartOpen: boolean
  setIsChartOpen: Dispatch<SetStateAction<boolean>>
  error: boolean
  setError: Dispatch<SetStateAction<boolean>>
}

const initialContext: TaoVotingContextType = {
  totalProposalProcess: {
    nonQuietVotingPeriod: 0,
    quietEndingPeriod: 0,
    executionDelay: 0,
  },
  delegatedVoting: {
    delegatedVotingPeriod: 0,
  },
  proposalProcessWithExtension: {
    voteDuration: 0,
    quietEndingExtension: 0,
    executionDelay: 0,
  },
  proposalDeposit: {
    token: 0,
    valueUsd: 0,
  },
  challengeDeposit: {
    token: 0,
    valueUsd: 0,
  },
  setlementPeriod: 0,
  setContext: (): void => {
    throw new Error('setContext must be overridden')
  },
  isReviewProposal: false,
  isChartOpen: false,
  setIsChartOpen: (): void => {
    throw new Error('setisChartOpen must be overridden')
  },
  error: false,
  setError: (): void => {
    throw new Error('setError must be overridden')
  },
}

const TaoVotingContext = createContext<TaoVotingContextType>(initialContext)

interface AppTaoVotingContextProps {
  children: React.ReactNode
}

function TaoVotingProvider({ children }: AppTaoVotingContextProps) {
  const [params, setContext] = useState<TaoVotingContextType>(initialContext)
  const [isReviewProposal, setReviewProposal] = useState<boolean>(false)
  const [isChartOpen, setIsChartOpen] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const {
    supportRequired,
    minimumQuorum,
    voteDuration,
    delegatedVotingPeriod,
    quietEndingPeriod,
    quietEndingExtension,
    executionDelay,
    proposalDeposit,
    challengeDeposit,
    settlementPeriod,
  } = useParams()

  useEffect(() => {
    const checkEmpty = [
      supportRequired,
      minimumQuorum,
      voteDuration,
      delegatedVotingPeriod,
      quietEndingPeriod,
      quietEndingExtension,
      executionDelay,
      proposalDeposit,
      challengeDeposit,
      settlementPeriod,
    ]
    if (checkEmpty.includes('')) {
      setReviewProposal(false)
    } else {
      setReviewProposal(true)
    }
    const typeTimeOut = setTimeout(() => {
      axios
        .post('/api/tao-voting/', {
          taoVoting: {
            supportRequired: Number(supportRequired) / 100,
            minimumQuorum: Number(minimumQuorum) / 100,
            voteDuration,
            delegatedVotingPeriod,
            quietEndingPeriod,
            quietEndingExtension,
            executionDelay,
          },
          disputableVoting: {
            proposalDeposit,
            challengeDeposit,
            settlementPeriod,
          },
        })
        .then((response) => {
          const output = response.data.data
          setContext({
            ...output.taoVoting,
            ...output.disputableVoting,
          })
        })
        .catch(() => {
          setError(true)
        })
    }, 500)
    return () => clearTimeout(typeTimeOut)
  }, [
    supportRequired,
    minimumQuorum,
    voteDuration,
    delegatedVotingPeriod,
    quietEndingPeriod,
    quietEndingExtension,
    executionDelay,
    proposalDeposit,
    challengeDeposit,
    settlementPeriod,
  ])

  return (
    <TaoVotingContext.Provider
      value={{
        ...params,
        isReviewProposal,
        isChartOpen,
        setIsChartOpen,
        error,
      }}
    >
      {children}
    </TaoVotingContext.Provider>
  )
}

function useTaoVoting() {
  const context = useContext(TaoVotingContext)

  return context
}

export { TaoVotingContext, TaoVotingProvider, useTaoVoting }
