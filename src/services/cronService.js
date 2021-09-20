import { Contract, utils } from 'near-api-js';
const cronContract = null;
const DEFAULT_GAS = 300000000000000;
const cronJobId = null;

// Initialize contract & set global variables
export async function initCronContract() {
    cronContract = await new Contract(window.walletConnection.account(), "cron.in.testnet", {
    viewMethods: ['get_task'],
    changeMethods: ['create_task', 'update_task']
  });
}

async function scheduleCronJob(callback) {
    if(!cronContract){
        await initCronContract();
    }
    cronContract.create_task({ contract_id: window.contract.contract_id, 
                                function_id: "start_auction", 
                                cadence: "*/2 * * * * *",  // run every 2 mins
                                recurring: true,
                                gas: DEFAULT_GAS
                            }, 
                            DEFAULT_GAS, 
                            utils.format.parseNearAmount(5))
        .then(jobId => {
            console.log("Job scheduled successfully with jobId: " + jobId);
            cronJobId = jobId;
            callback(jobId);
        })
        .catch(ex => {
            console.log("Job scheduling failed");
            callback(0);
            throw ex;
        });
}

async function getJobStatus(callback){
    if(!cronContract){
        await initCronContract();
    }
    cronContract.get_task({ task_hash: cronJobId })
        .then(result => {
            console.log("job details: " + result);
            callback(result); 
        })
        .catch(ex => {
            console.log("getting items failed");
            throw ex;
        });
}

export default {
    scheduleCronJob: scheduleCronJob, 
    getJobStatus: getJobStatus
}

//near call cron.in.testnet create_task '{"contract_id": "counter.in.testnet","function_id": "increment","cadence": "*/10 * * * * *","recurring": true,"deposit": 10,"gas": 2400000000000}' --accountId YOUR_NEAR_ACCT.testnet --amount 10
