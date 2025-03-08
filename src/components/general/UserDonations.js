import React, { useEffect, useMemo, useState } from 'react';
import Web3 from 'web3';

// HOOKS
import useWeb3 from '../../hooks/useWeb3';
import useApp from '../../hooks/useApp';

// COMPONENTS
import loadCampaignContributors from '../../lib/loadCampaignContributors';

function UserDonations({ id }) {
    const { account } = useWeb3();
    const [donations, setDonations] = useState([]);
    const { contract, abi, paymentTokens, donationCount } = useApp();

    useEffect(() => {
        /* --------------------------------------------- 
              GET THE USER DONATIONS
        --------------------------------------------- */
        async function checkUserDonation() {
            try {
                const userDonations = await loadCampaignContributors(contract, abi, Number(id));

                setDonations(
                    userDonations
                        ?.filter((donation) => donation[0] === account)
                        ?.map((donation) => ({
                            user: donation[0],
                            token: donation[1],
                            amount: Number(
                                Web3.utils.fromWei(
                                    Number(donation[2]).toLocaleString('fullwide', { useGrouping: false }).toString(),
                                    'ether'
                                )
                            ),
                        }))
                );
            } catch (err) {
                console.log(err);
            }
        }

        checkUserDonation();
    }, [id, account, donationCount, abi, contract]);

    /* --------------------------------------------- 
          CHECK IF THE USER IS A DONATOR
    --------------------------------------------- */
    const isContributer = useMemo(() => {
        if (donations?.filter((donation) => donation?.amount > 0)?.length > 0) {
            return true;
        } else {
            return false;
        }
    }, [donations]);

    return (
        <>
            {isContributer && paymentTokens?.length > 0 && (
                <>
                    <div className='campaing-user-donations'>
                        <p className='small fw-bold tex-xs mb-2'>MY DONATIONS</p>

                        <ul className='donation-list list-unstyled mb-0'>
                            {donations?.map((donation, index) => {
                                return (
                                    <li key={index}>
                                        {donation?.amount}{' '}
                                        {
                                            paymentTokens?.filter((token) => token?.address === donation?.token)[0]
                                                ?.symbol
                                        }
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <span className='campaign-top-badge badge bg-primary'>Contributed</span>
                </>
            )}
        </>
    );
}

export default UserDonations;
