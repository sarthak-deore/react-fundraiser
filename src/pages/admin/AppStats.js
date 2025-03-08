import React, { useMemo } from 'react';

// HOOKS
import useCampaign from '../../hooks/useCampaign';
import useUser from '../../hooks/useUser';

function AppStats() {
    const { allCampaigns } = useCampaign();
    const { usersList } = useUser();

    // Pending campaigns
    const PendingCampaigns = useMemo(() => {
        return allCampaigns?.filter((camp) => camp?.pending);
    }, [allCampaigns]);

    // Successful Campaigns
    const successfulCampaigns = useMemo(() => {
        return allCampaigns?.filter((camp) => camp?.ended && camp?.pledged >= camp?.goal);
    }, [allCampaigns]);

    // Failed Campaigns
    const failedCampaigns = useMemo(() => {
        return allCampaigns?.filter((camp) => camp?.ended && camp?.pledged < camp?.goal);
    }, [allCampaigns]);

    // Active Campaigns
    const activeCampaigns = useMemo(() => {
        return allCampaigns?.filter((camp) => !camp?.pending && !camp?.ended);
    }, [allCampaigns]);

    // Total Donations
    const totalDonations = useMemo(() => {
        if (allCampaigns?.length > 0) {
            return allCampaigns?.map((camp) => camp?.pledged)?.reduce((a, b) => Number(a) + Number(b));
        } else {
            return '0';
        }
    }, [allCampaigns]);

    // TOTAL CAMPAIGNS VALUE
    const totalCampaingsValue = useMemo(() => {
        if (allCampaigns?.length > 0) {
            return allCampaigns?.map((camp) => camp?.goal)?.reduce((a, b) => Number(a) + Number(b));
        } else {
            return '0';
        }
    }, [allCampaigns]);

    return (
        <>
            <div className='row g-3'>
                {/* ALL CAMPAIGNS */}
                <div className='col-lg-3 col-md-6'>
                    <div className='card mb-0'>
                        <div className='card-body text-center'>
                            <p className='h1'>{allCampaigns?.length}</p>
                            <p className='mb-0'>Total Campaigns</p>
                        </div>
                    </div>
                </div>

                {/* ALL USERS */}
                <div className='col-lg-3 col-md-6'>
                    <div className='card mb-0'>
                        <div className='card-body text-center'>
                            <p className='h1'>{usersList?.length}</p>
                            <p className='mb-0'>Total Users</p>
                        </div>
                    </div>
                </div>

                {/* ACTIVE CAMPAIGNS */}
                <div className='col-lg-3 col-md-6'>
                    <div className='card mb-0'>
                        <div className='card-body text-center'>
                            <p className='h1'>{activeCampaigns?.length}</p>
                            <p className='mb-0'>Active Campaigns</p>
                        </div>
                    </div>
                </div>

                {/* PENDING CAMPAIGNS */}
                <div className='col-lg-3 col-md-6'>
                    <div className='card mb-0'>
                        <div className='card-body text-center'>
                            <p className='h1'>{PendingCampaigns?.length}</p>
                            <p className='mb-0'>Pending Campaigns</p>
                        </div>
                    </div>
                </div>

                {/* SUCCESSFUL CAMPAIGNS */}
                <div className='col-lg-3 col-md-6'>
                    <div className='card mb-0'>
                        <div className='card-body text-center'>
                            <p className='h1'>{successfulCampaigns?.length}</p>
                            <p className='mb-0'>Successful Campaigns</p>
                        </div>
                    </div>
                </div>

                {/* FAILED CAMPAIGNS */}
                <div className='col-lg-3 col-md-6'>
                    <div className='card mb-0'>
                        <div className='card-body text-center'>
                            <p className='h1'>{failedCampaigns?.length}</p>
                            <p className='mb-0'>Failed Campaigns</p>
                        </div>
                    </div>
                </div>

                {/* TOTAL DONATIONS */}
                {totalDonations && (
                    <div className='col-lg-3 col-md-6'>
                        <div className='card mb-0'>
                            <div className='card-body text-center'>
                                <p className='h1'>
                                    {totalDonations} <span className='text-sm'>USD</span>
                                </p>
                                <p className='mb-0'>Total Donations</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* TOTAL CAMPAIGNS VALUE */}
                {totalCampaingsValue && (
                    <div className='col-lg-3 col-md-6'>
                        <div className='card mb-0'>
                            <div className='card-body text-center'>
                                <p className='h1'>
                                    {totalCampaingsValue} <span className='text-sm'>USD</span>
                                </p>
                                <p className='mb-0'>Total Campaigns Value</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AppStats;
