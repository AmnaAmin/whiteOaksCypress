import { Octokit } from '@octokit/rest'
import users from '../data/users.json'

var octokit

const owner = 'DevTek-ai'

const frontendRepo: { repo: string; branch: string }[] = [
  { repo: 'woa-fe-const-ui', branch: 'master' },
  { repo: 'woa-fe-est-ui', branch: 'master' },
  { repo: 'woa-fe-mnt-ui', branch: 'master' },
]

const constBackend: { repo: string; branch: string }[] = [
  { repo: 'woa-be-const-api', branch: 'master' },
  { repo: 'woa-be-const-audit', branch: 'master' },
  { repo: 'woa-be-const-swo', branch: 'master' },
  { repo: 'woa-be-const-alerting', branch: 'master' },
  { repo: 'woa-be-const-messaging', branch: 'master' },
]

const estBackend: { repo: string; branch: string }[] = [{ repo: 'woa-be-est-api', branch: 'master' }]

const maintBackend: { repo: string; branch: string }[] = [
  { repo: 'woa-be-mnt-api', branch: 'master' },
  { repo: 'woa-be-mnt-messaging', branch: 'master' },
  { repo: 'woa-be-mnt-swo', branch: 'master' },
  { repo: 'woa-be-mnt-contact-center', branch: 'master' },
  { repo: 'woa-be-mnt-contact-service', branch: 'master' },
]

export async function checkBranchLocked(option: number) {
  octokit = new Octokit({
    auth: null, //process.env.REACT_APP_GITHUB_TOKEN,
    baseUrl: 'https://api.github.com',
  })

  var response

  switch (option) {
    case 1:
      response = await getProtectionRules(frontendRepo[0].repo, frontendRepo[0].branch)
      break
    case 2:
      response = await getProtectionRules(constBackend[0].repo, constBackend[0].branch)
      break
    case 3:
      response = await getProtectionRules(frontendRepo[1].repo, frontendRepo[1].branch)
      break
    case 4:
      response = await getProtectionRules(estBackend[0].repo, estBackend[0].branch)
      break
    case 5:
      response = await getProtectionRules(frontendRepo[2].repo, frontendRepo[2].branch)
      break
    case 6:
      response = await getProtectionRules(maintBackend[0].repo, maintBackend[0].branch)
      break
    default:
      break
  }

  return response
}

async function getProtectionRules(repo: string, branch: string) {
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/branches/{branch}/protection', {
      owner: owner,
      repo: repo,
      branch: branch,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    const isLockBranchEnabled = response.data.lock_branch.enabled

    if (isLockBranchEnabled === true) {
      return 0
    } else if (isLockBranchEnabled === false) {
      return 1
    } else {
      return 2
    }
  } catch (err) {
    console.error('Error :', err)
    return 2
  }
}

export async function triggerLockAPI(token, option: number, isLocked: boolean) {
  const isTokenValid = await validateToken(token)
  var response = 2

  if (isTokenValid) {
    switch (option) {
      case 1:
        response = await lockMergeWindow(frontendRepo[0].repo, frontendRepo[0].branch, isLocked)
        break
      case 2:
        for (const { repo, branch } of constBackend) {
          response = await lockMergeWindow(repo, branch, isLocked)
        }
        break
      case 3:
        response = await lockMergeWindow(frontendRepo[1].repo, frontendRepo[1].branch, isLocked)
        break
      case 4:
        for (const { repo, branch } of estBackend) {
          response = await lockMergeWindow(repo, branch, isLocked)
        }
        break
      case 5:
        response = await lockMergeWindow(frontendRepo[2].repo, frontendRepo[2].branch, isLocked)
        break
      case 6:
        for (const { repo, branch } of maintBackend) {
          response = await lockMergeWindow(repo, branch, isLocked)
        }
        break
      default:
        break
    }
  }

  return response
}

async function lockMergeWindow(repo: string, branch: string, isLocked: boolean) {
  try {
    var response

    if (repo === 'woa-fe-const-ui') {
      response = await octokit.request('PUT /repos/{owner}/{repo}/branches/{branch}/protection', {
        owner: owner,
        repo: repo,
        branch: branch,
        required_status_checks: {
          strict: true,
          context: ['Pre-Prod: Unit Tests?'],
          checks: [
            {
              context: 'Pre-Prod: Unit Tests?',
              app_id: 72,
            },
          ],
        },
        enforce_admins: null,
        required_pull_request_reviews: {
          required_approving_review_count: 1,
        },
        restrictions: null,
        lock_branch: isLocked,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })
    } else {
      response = await octokit.request('PUT /repos/{owner}/{repo}/branches/{branch}/protection', {
        owner: owner,
        repo: repo,
        branch: branch,
        required_status_checks: {
          strict: true,
          context: [],
          checks: [],
        },
        enforce_admins: null,
        required_pull_request_reviews: {
          required_approving_review_count: 1,
        },
        restrictions: null,
        lock_branch: isLocked,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      })
    }

    if (response.status === 200 && isLocked) {
      alert('Branch for ' + repo + ' locked successfully')
      return 0
    } else if (response.status === 200 && !isLocked) {
      alert('Branch for ' + repo + ' unlocked successfully')
      return 1
    } else {
      alert('Failed to lock branch for ' + repo)
      return 2
    }
  } catch (err) {
    alert('Invalid or Expired User Token')
    console.error('Error :', err)
    return 2
  }
}

async function validateToken(token) {
  octokit = new Octokit({
    auth: token,
    baseUrl: 'https://api.github.com',
  })

  try {
    const response = await octokit.request('GET /user', {
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
      },
    })

    const userName = response.data.login

    console.log('list is: ' + users)

    if (users.includes(userName)) {
      return true
    } else {
      alert('User does not have valid Permissions')
      return false
    }
  } catch (err) {
    alert('Invalid or Expired User Token')
    console.error('Error :', err)
    return 2
  }
}
