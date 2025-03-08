import React from 'react';

// HOOKS
import useCampaign from '../../hooks/useCampaign';

// COMPONENTS
import FundraiseCard from '../../components/general/FundraiseCard';
import NoDataAlert from '../../components/general/NoDataAlert';

function RecentFundraises() {
    const { allCampaigns } = useCampaign();

    return (
        <>
            <section className='py-5 bg-darker'>
                <div className='container py-5'>
                    <header className='text-center mb-5'>
                        <div className='col-lg-7 mx-auto'>
                            <p className='h4 mb-0 text-primary'>Businesses You Can Back</p>
                            <h2 className='h1'>Explore the Best Featured Projects</h2>
                        </div>
                    </header>

                    <div className='row g-3'>
                        {allCampaigns?.slice(0, 8)?.map((camp, index) => {
                            return (
                                <div className='col-xxl-3 col-lg-4' key={index}>
                                    <FundraiseCard {...camp} pending={camp.startAt > new Date().getTime()} />
                                </div>
                            );
                        })}
                    </div>

                    {allCampaigns?.slice(0, 8)?.length === 0 && <NoDataAlert text="There're no campaigns yet" />}
                </div>
            </section>
        </>
    );
}

export default RecentFundraises;
