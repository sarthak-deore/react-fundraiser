import React, { useMemo } from 'react';

// HOOKS
import useUser from '../../hooks/useUser';
import useCampaign from '../../hooks/useCampaign';

function UserStats() {
    const { userInfo } = useUser();
    const { allCampaigns } = useCampaign();

    // TOTAL CAMPAIGNS VALUE
    const userCampaingsValue = useMemo(() => {
        const arr = allCampaigns?.filter((camp) => camp?.creator === userInfo?.address)?.map((camp) => camp?.goal);
        if (arr?.length > 0) {
            return arr?.reduce((a, b) => Number(a) + Number(b));
        } else {
            return 0;
        }
    }, [allCampaigns, userInfo]);

    // TOTAL CAMPAIGNS VALUE
    const userDonationsValue = useMemo(() => {
        const arr = allCampaigns
            ?.filter((camp) => camp?.creator === userInfo?.address && camp?.pledged >= camp?.goal)
            ?.map((camp) => camp?.pledged);
        if (arr?.length > 0) {
            return arr?.reduce((a, b) => Number(a) + Number(b));
        } else {
            return 0;
        }
    }, [allCampaigns, userInfo]);

    return (
        <>
            <div className='row g-3 mb-3 justify'>
                <div className='col-lg-6 text-center'>
                    <div className='card mb-0'>
                        <div className='card-body'>
                            <p className='h1 mb-0'>
                                {userCampaingsValue && userCampaingsValue} <span className='text-xs'>USD</span>
                            </p>
                            <p className='mb-0'>My total campaigns value</p>
                        </div>
                    </div>
                </div>
                <div className='col-lg-6 text-center'>
                    <div className='card mb-0'>
                        <div className='card-body'>
                            <p className='h1 mb-0'>
                                {userDonationsValue && userDonationsValue} <span className='text-xs'>USD</span>
                            </p>
                            <p className='mb-0'>Total Donations I Received</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserStats;
