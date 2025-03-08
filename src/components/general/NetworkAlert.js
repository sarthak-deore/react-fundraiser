import React from 'react';
import { appSettings } from '../../helpers/settings';

// COMPONENTS
import ConnectWalletHander from './ConnectWalletHandler';

function NetworkAlert() {
    return (
        <div className='fullscreen-loader'>
            <div className='fullscreen-loader-inner'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-lg-7 mx-auto text-center'>
                            <div className='card shadow'>
                                <div className='card-body p-4 p-lg-5'>
                                    <img src='/metamask.png' alt='Kovan Test Network' className='mb-4' width='50' />
                                    <h2 className='h5 mb-1'>
                                        This Demo is set to run on{' '}
                                        <span className='text-orange orange text-backline'>
                                            {appSettings.activeNetworkName}
                                        </span>
                                    </h2>
                                    <p className='text-muted fw-normal mb-4'>
                                        Click the button below to switch your network
                                    </p>
                                    <ConnectWalletHander />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NetworkAlert;
