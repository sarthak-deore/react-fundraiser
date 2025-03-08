import React, { useMemo } from 'react';
import useApp from '../../hooks/useApp';
import { toast } from 'react-toastify';
import { useContractWrite } from 'wagmi';

// HOOKS
import useCampaign from '../../hooks/useCampaign';
import useWeb3 from '../../hooks/useWeb3';

// COMPONENTS
import ConnectWalletHander from './ConnectWalletHandler';

function ClaimFundsHandler({ id, customClass, goal, endAt, pledged, creator, claimed }) {
    const { account } = useWeb3();
    const { contract, abi, setTransactionLoading, setDonateModalStatus, setDonateModalSrc } = useApp();
    const { campaignContract, campaignContractAbi, loadAllCampaigns } = useCampaign();

    /* --------------------------------------------- 
              CLAIM CAMPAIGN DONTATIONS
     --------------------------------------------- */
    const { write: web3ClaimFunds } = useContractWrite({
        address: contract?.address,
        abi: abi,
        functionName: 'claim',
        args: [Number(id)],
        onSuccess() {
            setTimeout(() => {
                setTransactionLoading(false);
                loadAllCampaigns(campaignContract, campaignContractAbi);
                toast.success('Great! you have claimed campaign profits');
            }, 5000);
        },
        onMutate() {
            setTransactionLoading(true);
        },
        onError(error) {
            setTransactionLoading(false);
            toast.error('Oops! Something went error');
        },
    });

    /* --------------------------------------------- 
          CMPAIGN GOAL STATUS COMPONENT
    --------------------------------------------- */
    const campaignCTA = useMemo(() => {
        return (
            <>
                {new Date().getTime() >= endAt && pledged >= goal ? (
                    account === creator && !claimed ? (
                        <button className={customClass} onClick={web3ClaimFunds}>
                            Claim Profits
                        </button>
                    ) : account !== creator && !claimed ? (
                        <button className='btn btn-opac-primary w-100 pointer-none'>Goal Reached</button>
                    ) : (
                        <button className='btn btn-opac-primary w-100 pointer-none'>Claimed</button>
                    )
                ) : new Date().getTime() >= endAt && pledged < goal ? (
                    <button className='btn btn-opac-danger w-100 pointer-none'>Failed reaching goal</button>
                ) : (
                    new Date().getTime() < endAt &&
                    (account ? (
                        <button
                            className='btn btn-primary w-100'
                            onClick={() => {
                                setDonateModalStatus(true);
                                setDonateModalSrc({ id });
                            }}
                        >
                            Donate
                        </button>
                    ) : (
                        <ConnectWalletHander />
                    ))
                )}
            </>
        );

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [endAt, goal, new Date().getTime(), claimed, pledged, account, creator]);

    return campaignCTA;
}

export default ClaimFundsHandler;
