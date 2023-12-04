import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: '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',
  baseUrl: "https://api.github.com"
});

const owner = 'DevTek-ai';
const repo = 'restore_db';

var workflowID;

 async function getDBWorkflow(): Promise<string> {
  
  try {
   
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows', {
      owner: owner,
      repo: repo,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    const workflow = response.data.workflows.find((workflow: any) => workflow.name === 'Restore Preprod DB from Prod');

    if (workflow) {
          workflowID = workflow.id;
          return workflowID;
    } 
    else {
          console.error('Workflow not found');
          return 'Workflow not found';
        }


  } catch (err) {
    console.error('Error getting workflows:', err);
    return 'Failed to fetch workflows list';
  }

}

export async function triggerDBWorkflow(): Promise<string> {
  await getDBWorkflow();
  try {
    const response = await octokit.request('POST /repos/{owner}/{repo}/actions/workflows/{workflow_id}/dispatches', {
            owner: owner,
            repo: repo,
            workflow_id: workflowID,
            ref: 'main',
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })

          if (response.status === 204) {
              return 'Build triggered successfully';
            } else {
              return 'Failed to trigger build';
            }

        } catch (err) {
          console.error('Error triggering workflow:', err);
          return 'Failed to trigger build';
        }
    } 
    
export async function getDbRestoreStatus(): Promise<string> {
  await getDBWorkflow();
  try {
    const response = await octokit.request('GET /repos/{owner}/{repo}/actions/workflows/{workflow_id}/runs', {
      owner: owner,
      repo: repo,
      workflow_id: workflowID,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    const status = response.data.workflow_runs[0]?.status;
    const conclusion = response.data.workflow_runs[0]?.conclusion;

    if(conclusion == null){
      return "The workflow is "+ status;
    }
    else{
      return "The workflow is "+ conclusion;
    }

  } catch (err) {
    console.error('Error getting list of runs for the workflow:', err);
    return 'Failed to fetch list of runs for workflow';
  }

}