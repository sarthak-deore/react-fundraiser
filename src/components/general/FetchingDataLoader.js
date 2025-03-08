import React from 'react';

function FetchingDataLoader({ heading, msg }) {
    return (
        <>
            <div className='fullscreen-loader'>
                <div className='fullscreen-loader-inner' data-aos='fade-up'>
                    <div className='p-3 flex-shrink-0 d-flex flex-column align-items-center'>
                        <div className='spin-loader mb-4'></div>
                        <div className='mt-3 text-center'>
                            <p className='h2'>{heading || 'Fetching Data'}</p>
                            <p className='text-muted text-sm'>
                                {msg || 'Please wait until we process the data from the blockchain'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FetchingDataLoader;
