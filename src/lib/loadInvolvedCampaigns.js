import { readContract } from '@wagmi/core';

async function loadInvolvedCampaigns(contract, abi, account) {
    try {
        const involvedIds = await readContract({
            address: contract?.address,
            abi: abi,
            functionName: 'getDonatedCampaignsByUser',
            args: [account],
        });

        return involvedIds;
    } catch (err) {
        console.log(err);
    }
}

export default loadInvolvedCampaigns;
