import React from 'react';
import { appSettings } from '../../helpers/settings';
import { switchNetwork } from '@wagmi/core';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';

// COMPONENTS
import ConnectWalletHander from './ConnectWalletHandler';

function ViewOnlyAlert() {
    const { account } = useWeb3();

    /* --------------------------------------------- 
          CHAHNGE NETWORK HANDLER
    --------------------------------------------- */
    async function changChain() {
        // eslint-disable-next-line no-unused-vars
        const network = await switchNetwork({
            chainId: appSettings.networkId,
        });
    }

    return (
        <div className='viewonly-mode'>
            <div className='px-4 text-end'>
                <div className='d-inline-block'>
                    <div className='card bg-gray-850 mb-0'>
                        <div className={`card-body text-center`}>
                            <h2 className='h6 mb-0 ms-2'>
                                This Demo is set to run on{' '}
                                <span className='text-orange orange text-backline'>
                                    {appSettings.activeNetworkName}
                                </span>
                            </h2>
                            <p className='text-muted text-sm'>Please Switch your network</p>
                            {account ? (
                                <button className='btn btn-primary switch-btn' onClick={changChain}>
                                    <img src='/wcbrand.svg' alt='wc' className='me-2' width='20' />
                                    SwitchNetwork
                                </button>
                            ) : (
                                <ConnectWalletHander />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ViewOnlyAlert;
