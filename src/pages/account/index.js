import React from 'react';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import useUser from '../../hooks/useUser';
import PendingCampaigns from './PendingCampaigns';
import UserActiveCampaigns from './UserActiveCampaigns';
import UserSuccessfulCampaigns from './UserSuccessfulCampaigns';
import InvolvedCampaigns from './CampaignsInvolved';
import UserFailedCampaigns from './UserFailedCampaigns';
import UserStats from './UserStatus';
import WaitingForApproval from './WaitingForApproval';

function AccountPage() {
    const { userInfo } = useUser();

    return (
        <>
            <PageBanner
                heading='My Account'
                text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, similique pariatur et corporis'
            ></PageBanner>
            <section className='pb-5 page-first-section'>
                <div className='container pb-5'>
                    <header className='mb-5 text-center'>
                        <h2 className='mb-0'>Hi {userInfo?.name}</h2>
                        <p className='text-muted'>Here're some stats about your account</p>
                    </header>
                    <div className='mb-3'>
                        <UserStats />
                    </div>

                    <div className='mb-3'>
                        <WaitingForApproval />
                    </div>
                    <div className='mb-3'>
                        <PendingCampaigns />
                    </div>
                    <div className='mb-3'>
                        <UserActiveCampaigns />
                    </div>
                    <div className='mb-3'>
                        <UserSuccessfulCampaigns />
                    </div>
                    <div className='mb-3'>
                        <InvolvedCampaigns />
                    </div>
                    <div className='mb-3'>
                        <UserFailedCampaigns />
                    </div>
                </div>
            </section>
        </>
    );
}

export default AccountPage;
