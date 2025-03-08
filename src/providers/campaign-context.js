import React from 'react';

const CampaignContext = React.createContext({
    campaignContract: null,
    campaignContractAbi: null,
    allCampaigns: [],
    pendingCampaigns: [],
    loadCampaignContract: () => {},
    getCampaignContractAbi: () => {},
    loadAllCampaigns: () => {},
});

export default CampaignContext;
