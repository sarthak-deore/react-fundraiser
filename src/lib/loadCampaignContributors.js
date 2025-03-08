import { readContract } from '@wagmi/core';

async function loadCampaignContributors(contract, abi, id) {
    try {
        const userDonations = await readContract({
            address: contract?.address,
            abi: abi,
            functionName: 'contributors',
            args: [Number(id)],
        });

        return userDonations;
    } catch (err) {
        console.log(err);
    }
}

export default loadCampaignContributors;
