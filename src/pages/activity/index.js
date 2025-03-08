import React from 'react';

// COMPONENTS
import PageBanner from '../../components/general/PageBanner';
import ActivityTable from './ActivityTable';

function ActivityPage() {
    return (
        <>
            <PageBanner
                heading='Recent Activities'
                text='Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, similique pariatur et corporis'
            ></PageBanner>
            <section className='pb-5 page-first-section'>
                <div className='container pb-5'>
                    <ActivityTable />
                </div>
            </section>
        </>
    );
}

export default ActivityPage;
