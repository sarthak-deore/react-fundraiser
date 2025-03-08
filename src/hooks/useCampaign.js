import { useContext } from 'react';
import Campaign from '../providers/campaign-context';

const useCampaign = () => {
    return useContext(Campaign);
};

export default useCampaign;
