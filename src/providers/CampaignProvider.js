import React, { useReducer } from 'react';
import { readContract } from '@wagmi/core';

import CampaignContext from './campaign-context';
import Web3 from 'web3';

const defaultCampaignState = {
    campaignContract: null,
    campaignContractAbi: null,
};

const appReducer = (state, action) => {
    if (action.type === 'CONTRACT') {
        return {
            ...state,
            campaignContract: action.campaignContract,
        };
    }
    if (action.type === 'GET_ABI') {
        return {
            ...state,
            campaignContractAbi: action.campaignContractAbi,
        };
    }
    if (action.type === 'GET_CAMPAIGNS') {
        return {
            ...state,
            pendingCampaigns: action.allCampaigns
                ?.map((camp) => {
                    return {
                        id: Number(camp[0]),
                        title: camp[1],
                        description: camp[2],
                        creator: camp[3],
                        goal: Web3.utils.fromWei(camp[4].toString(), 'gwei'),
                        pledged: Web3.utils.fromWei(camp[5].toString(), 'gwei'),
                        startAt: Number(camp[6]) * 1000,
                        endAt: Number(camp[7]) * 1000,
                        claimed: camp[8],
                        status: camp[9] === 0 ? 'pending' : camp[9] === 1 ? 'approved' : 'canceled',
                        category: camp[10],
                        cover: camp[11],
                        pending: new Date().getTime() < new Date(Number(camp[6]) * 1000).getTime(),
                        ended: new Date().getTime() > new Date(Number(camp[7]) * 1000).getTime(),
                    };
                })
                ?.filter((camp) => camp?.status === 'pending')
                ?.sort((a, b) => b?.id - a?.id),
            allCampaigns: action.allCampaigns
                ?.map((camp) => {
                    return {
                        id: Number(camp[0]),
                        title: camp[1],
                        description: camp[2],
                        creator: camp[3],
                        goal: Web3.utils.fromWei(camp[4].toString(), 'gwei'),
                        pledged: Web3.utils.fromWei(camp[5].toString(), 'gwei'),
                        startAt: Number(camp[6]) * 1000,
                        endAt: Number(camp[7]) * 1000,
                        claimed: camp[8],
                        status: camp[9] === 0 ? 'disaproved' : camp[9] === 1 ? 'approved' : 'canceled',
                        category: camp[10],
                        cover: camp[11],
                        pending: new Date().getTime() < new Date(Number(camp[6]) * 1000).getTime(),
                        ended: new Date().getTime() > new Date(Number(camp[7]) * 1000).getTime(),
                    };
                })
                ?.filter((camp) => camp?.status === 'approved')
                ?.sort((a, b) => b?.id - a?.id),
        };
    }

    return defaultCampaignState;
};

const CampaignProvider = (props) => {
    const [campaignState, dispatchCampaignAction] = useReducer(appReducer, defaultCampaignState);

    const getCampaignContractAbiHandler = (campaignContractAbi) => {
        dispatchCampaignAction({ type: 'GET_ABI', campaignContractAbi: campaignContractAbi });
    };

    const loadCampaignContractHandler = (campaignContract) => {
        dispatchCampaignAction({ type: 'CONTRACT', campaignContract: campaignContract });
        return campaignContract;
    };

    const loadAllCampaignsHandler = async (campaignContract, abi) => {
        const allCampaigns = await readContract({
            address: campaignContract.address,
            abi: abi,
            functionName: 'getCampaigns',
        });
        dispatchCampaignAction({ type: 'GET_CAMPAIGNS', allCampaigns: allCampaigns });
        return allCampaigns;
    };

    const campaignContext = {
        campaignContract: campaignState.campaignContract,
        campaignContractAbi: campaignState.campaignContractAbi,
        allCampaigns: campaignState.allCampaigns,
        pendingCampaigns: campaignState.pendingCampaigns,
        loadCampaignContract: loadCampaignContractHandler,
        getCampaignContractAbi: getCampaignContractAbiHandler,
        loadAllCampaigns: loadAllCampaignsHandler,
    };

    return <CampaignContext.Provider value={campaignContext}>{props.children}</CampaignContext.Provider>;
};

export default CampaignProvider;
