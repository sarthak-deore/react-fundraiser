import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import loadCampaignContributors from '../../lib/loadCampaignContributors';
import { useContractWrite } from 'wagmi';
import { toast } from 'react-toastify';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useApp from '../../hooks/useApp';
import useCampaign from '../../hooks/useCampaign';

function UserCampaignContributions({ id, goal, pledged, ended }) {
    const { account } = useWeb3();
    const [contributions, setContributions] = useState([]);
    const { contract, abi, paymentTokens, donationCount, setTransactionLoading, setDonationCount } = useApp();
    const { campaignContract, campaignContractAbi, loadAllCampaigns } = useCampaign();

    /* --------------------------------------------- 
          GET THE USER DONATIONS
    --------------------------------------------- */
    useEffect(() => {
        async function checkUserDonation() {
            try {
                const donations = await loadCampaignContributors(contract, abi, Number(id));

                setContributions(
                    donations
                        ?.filter((donation) => donation[2] !== 0 && donation[0] === account)
                        ?.map((donation) => ({
                            user: donation[0],
                            token: donation[1],
                            amount: Number(
                                Web3.utils.fromWei(
                                    Number(donation[2]).toLocaleString('fullwide', { useGrouping: false }).toString(),
                                    'ether'
                                )
                            ),
                            usdAmount: paymentTokens
                                ? Number(
                                      Web3.utils.fromWei(
                                          Number(donation[2])
                                              .toLocaleString('fullwide', { useGrouping: false })
                                              .toString(),
                                          'ether'
                                      )
                                  ) *
                                  Number(paymentTokens?.filter((token) => token?.address === donation[1])[0]?.usdValue)
                                : 0,
                        }))
                        ?.filter((donation) => donation?.amount !== 0)
                );
            } catch (err) {
                console.log(err);
            }
        }

        checkUserDonation();
    }, [id, account, donationCount, contract, abi, paymentTokens]);

    /* --------------------------------------------- 
              WITHDRAW PLEDGED TOKENS
     --------------------------------------------- */
    const { write: web3WithdrawTokens } = useContractWrite({
        address: contract?.address,
        abi: abi,
        functionName: 'refund',
        onSuccess() {
            setTimeout(() => {
                setTransactionLoading(false);
                loadAllCampaigns(campaignContract, campaignContractAbi);
                toast.success('Your funds has been sent to your wallet');
                setDonationCount();
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
          FIRE THE WITHDRAW FUNCTION ON CLICK
    --------------------------------------------- */
    function handleWithdraw() {
        web3WithdrawTokens({
            recklesslySetUnpreparedArgs: [id],
        });
    }

    return (
        <>
            {contributions?.length > 0 && paymentTokens?.length > 0 && (
                <>
                    <div className='glass-bg p-4 mt-4'>
                        <h6 className='mb-3 text-start'>My Contributions</h6>

                        <ul className='glass-list list-unstyled mb-0'>
                            {contributions?.map((donation, index) => {
                                return (
                                    <li key={index}>
                                        <div>
                                            <span>
                                                {!isNaN(donation?.usdAmount) ? donation?.usdAmount.toFixed(2) : '...'}
                                            </span>{' '}
                                            <span>USD</span>
                                        </div>
                                        <div className='text-muted text-sm'>
                                            <span>
                                                <span>{donation?.amount?.toFixed(2)}</span>{' '}
                                                {
                                                    paymentTokens?.filter(
                                                        (token) => token?.address === donation?.token
                                                    )[0]?.symbol
                                                }
                                            </span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>

                        {(!ended || pledged < goal) && (
                            <div className='mt-3'>
                                <button className='glassy-btn w-100' type='button' onClick={handleWithdraw}>
                                    Withdraw
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    );
}

export default UserCampaignContributions;
