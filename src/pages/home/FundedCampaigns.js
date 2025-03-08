import React, { useMemo } from 'react';

// HOOKS
import useCampaign from '../../hooks/useCampaign';

// COMPONENTS
import FundraiseCard from '../../components/general/FundraiseCard';
import NoDataAlert from '../../components/general/NoDataAlert';

function FundedCampaigns() {
    const { allCampaigns } = useCampaign();

    // GET THE SUCCESSFUL CAMPAIGNS
    const fundedCampaigns = useMemo(() => {
        return allCampaigns?.filter((camp) => camp.ended && camp?.pledged >= camp?.goal);
    }, [allCampaigns]);

    return (
        <>
            <section className='py-5 bg-darker'>
                <div className='container py-5'>
                    <header className='text-center mb-5'>
                        <div className='col-lg-7 mx-auto'>
                            <p className='h4 mb-0 text-primary'>successful milestones</p>
                            <h2 className='h1'>Funded Projects</h2>
                        </div>
                    </header>

                    <div className='row g-3'>
                        {fundedCampaigns && fundedCampaigns?.length > 0 ? (
                            fundedCampaigns.map((camp, index) => {
                                return (
                                    <div className='col-xxl-3 col-lg-4' key={index}>
                                        <FundraiseCard {...camp} />
                                    </div>
                                );
                            })
                        ) : (
                            <NoDataAlert text="There're no funded campaigns at the moment" />
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default FundedCampaigns;
