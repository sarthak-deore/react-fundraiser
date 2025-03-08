import React, { useState } from 'react';
import { RiMoneyDollarCircleFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import { useContractWrite } from 'wagmi';

// HOOKS
import useApp from '../../hooks/useApp';
import useWeb3 from '../../hooks/useWeb3';

function TokensUSDPricing() {
    const { account } = useWeb3();
    const { paymentTokens, contract, abi, setTransactionLoading, loadPaymentTokens } = useApp();
    const [tokenVals, setTokenVals] = useState([]);

    /* --------------------------------------------- 
          CHANGE USER USD VALUE INPUTS
    --------------------------------------------- */
    function handleTokenPrice(token, price) {
        setTokenVals([...tokenVals?.filter((el) => el.token !== token), { token, price }]);
    }

    /* --------------------------------------------- 
          SET TOKEN VALUE IN USD
     --------------------------------------------- */
    const { write: web3SetTokenValue } = useContractWrite({
        address: contract?.address,
        abi: abi,
        functionName: 'setTokenPriceInUSDT',
        onSuccess() {
            setTimeout(() => {
                loadPaymentTokens(contract, abi, account);
                setTransactionLoading(false);
                toast.success('Token USD value has been set');
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
          SIGN TOKEN VALUE TRANSACTION
    --------------------------------------------- */
    function handleSetTokenValueInUSD(token, price) {
        console.log(token, price);
        web3SetTokenValue({
            recklesslySetUnpreparedArgs: [token, price],
        });
    }

    return (
        <>
            <div className='card shadow-lg mb-0' data-aos='fade-up' data-aos-delay='200'>
                <div className='card-body p-lg-5'>
                    <div className='d-flex mb-5'>
                        <div className='stats-icon solid-green'>
                            <RiMoneyDollarCircleFill size='1.4rem' />
                        </div>
                        <div className='ms-3'>
                            <h2 className='mb-0 h4'>Set Tokens Pricing in USD</h2>
                            <p className='text-muted fw-normal mb-0'>
                                <strong>Important!</strong> These values cannot be changed later
                            </p>
                        </div>
                    </div>

                    <div className='row g-4'>
                        {paymentTokens?.map((token, index) => {
                            return (
                                <div className='col-auto flex-fill' key={index}>
                                    <div className='bg-darker p-4 rounded'>
                                        <p className='mb-3'>{token?.symbol}</p>
                                        {token?.usdValue !== '0' ? (
                                            <p className='mb-0'>
                                                This token USD value is{' '}
                                                <span className='text-primary'>{token?.usdValue} USD</span>
                                            </p>
                                        ) : (
                                            <>
                                                <input
                                                    type='number'
                                                    className='form-control mb-2'
                                                    placeholder='Add price in USD'
                                                    onChange={(e) => {
                                                        handleTokenPrice(token.address, e.target.value);
                                                    }}
                                                />
                                                <button
                                                    className='btn btn-primary w-100'
                                                    type='button'
                                                    onClick={() =>
                                                        handleSetTokenValueInUSD(
                                                            token?.address,
                                                            tokenVals?.filter((el) => el?.token === token?.address)[0]
                                                                ?.price
                                                        )
                                                    }
                                                >
                                                    Set Value
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}

export default TokensUSDPricing;
