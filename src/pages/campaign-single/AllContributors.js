import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import loadCampaignContributors from '../../lib/loadCampaignContributors';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useApp from '../../hooks/useApp';

function CampaignContributors({ id }) {
    const { account } = useWeb3();
    const [contributors, setContributors] = useState([]);
    const { contract, abi, paymentTokens, donationCount } = useApp();

    /* ---------------------------------------------------- 
          CHECK THE USER DONATIONS IN TARGET CAMPAIGN
    ---------------------------------------------------- */
    useEffect(() => {
        async function checkUserDonation() {
            try {
                const donations = await loadCampaignContributors(contract, abi, Number(id));

                setContributors(
                    donations
                        ?.filter((donation) => donation[2] !== 0)
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

    return (
        <>
            {contributors?.length > 0 && paymentTokens?.length > 0 && (
                <>
                    <div className='glass-bg p-4'>
                        <h6 className='mb-3'>Contributions</h6>

                        <ul className='glass-list list-unstyled mb-0'>
                            {contributors?.map((donation, index) => {
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
                    </div>
                </>
            )}
        </>
    );
}

export default CampaignContributors;
