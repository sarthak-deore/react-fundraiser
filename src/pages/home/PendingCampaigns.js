import React, { useMemo } from 'react';

// HOOKS
import useCampaign from '../../hooks/useCampaign';

// COMPONENTS
import FundraiseCard from '../../components/general/FundraiseCard';
import NoDataAlert from '../../components/general/NoDataAlert';

function PendingCampaigns() {
    const { allCampaigns } = useCampaign();

    const today = new Date().getTime();
    const pendingCampaigns = useMemo(() => {
        return allCampaigns?.filter((camp) => camp.startAt > today);
    }, [today, allCampaigns]);

    return (
        <>
            <section className='py-5 bg-darker'>
                <div className='container py-5'>
                    <header className='text-center mb-5'>
                        <div className='col-lg-7 mx-auto'>
                            <p className='h4 mb-0 text-primary'>Starting Soon</p>
                            <h2 className='h1'>Campagins have not started yet</h2>
                        </div>
                    </header>

                    <div className='row g-3'>
                        {pendingCampaigns && pendingCampaigns?.length > 0 ? (
                            pendingCampaigns.map((camp, index) => {
                                return (
                                    <div className='col-xxl-3 col-lg-4' key={index}>
                                        <FundraiseCard {...camp} pending={true} />
                                    </div>
                                );
                            })
                        ) : (
                            <NoDataAlert text="There're no pending campaigns at the moment" />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default PendingCampaigns;
