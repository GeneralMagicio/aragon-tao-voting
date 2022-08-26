import mongoose from 'mongoose'

interface ErrorMessage {
  error: boolean
  message: string
  statusCode: number
}

const noErrorMessage: ErrorMessage = {
  error: false,
  message: '',
  statusCode: 200,
}

function checkMissinEnvVars(): ErrorMessage {
  const requiredEnvVars = [
    'GITHUB_AUTH',
    'GITHUB_OWNER',
    'GITHUB_REPO',
    'DB_CONNECTION',
    'IMGUR_CLIENT_ID',
    'DEPLOYED_URL',
  ]
  let missingEnvVars: string[] = []
  requiredEnvVars.map((envVar) => {
    if (process.env[envVar] === undefined) {
      missingEnvVars.push(envVar)
    }
  })
  if (missingEnvVars.length > 0) {
    return {
      error: true,
      message: `The following environmental variables are not defined: ${missingEnvVars}`,
      statusCode: 500,
    }
  }
  return noErrorMessage
}

async function checkGitHubRepoExists(): Promise<ErrorMessage> {
  const GITHUB_OWNER = process.env.GITHUB_OWNER as string
  const GITHUB_REPO = process.env.GITHUB_REPO as string

  const response = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}`
  )
  if (response.status === 200) {
    return noErrorMessage
  }

  return {
    error: true,
    message: 'Could not find selected GitHub repository.',
    statusCode: response.status,
  }
}

async function checkMongodbConnection(): Promise<ErrorMessage> {
  try {
    await mongoose.connect(process.env.DB_CONNECTION as string)
    return noErrorMessage
  } catch (e: any) {
    console.log(e.message)
    return {
      error: true,
      message: e.message,
      statusCode: 404,
    }
  }
}

export default async function envVarChecker({
  missingEnvVars = true,
  gitHubRepoExists = true,
  mongodbConnection = true,
} = {}): Promise<ErrorMessage> {
  if (missingEnvVars) {
    const checkMissinEnvVarsResp: ErrorMessage = checkMissinEnvVars()
    if (checkMissinEnvVarsResp.error) return checkMissinEnvVarsResp
  }

  if (gitHubRepoExists) {
    const checkGitHubRepoExistsResp: ErrorMessage =
      await checkGitHubRepoExists()
    if (checkGitHubRepoExistsResp.error) return checkGitHubRepoExistsResp
  }

  if (mongodbConnection) {
    const checkMongodbConnectionResp: ErrorMessage =
      await checkMongodbConnection()
    if (checkMongodbConnectionResp.error) return checkMongodbConnectionResp
  }

  return noErrorMessage
}
