import React, { useMemo, useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useContractWrite } from 'wagmi';
import { waitForTransaction } from '@wagmi/core';
import Popup from './Popup';
import Select from 'react-select';
import Web3 from 'web3';

// HOOKS
import useApp from '../../hooks/useApp';
import useCampaign from '../../hooks/useCampaign';

// TOKEN ABIs
import TokenAbi from '../../integration/TokenAbi.json';

/* --------------------------------------------- 
      REACT SELECT DROPDOWN CUSTOM OPTION
--------------------------------------------- */
const formatOptionLabel = ({ value, label, usdValue }) => (
    <div style={{ display: 'flex' }}>
        <div>{label}</div>
        <div className='text-xs text-muted ms-2'>
            {' '}
            - <span className='text-primary'>{usdValue} usd</span> per token
        </div>
    </div>
);

function DonatePopup() {
    const {
        paymentTokens,
        contract,
        abi,
        donateModalSrc,
        setDonateModalStatus,
        setTransactionLoading,
        setDonationCount,
    } = useApp();
    const { campaignContract, campaignContractAbi, loadAllCampaigns } = useCampaign();
    const [approvedTx, setApprovedTx] = useState(null);
    const [donationAmount, setDontationAmount] = useState(null);
    const [usdDonationAmount, setUSDDonationAmount] = useState(null);
    const {
        register,
        control,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // REFROMATE PAYMENT METHODS
    const paymentMethods = useMemo(() => {
        return paymentTokens.map((token) => ({ ...token, label: token.symbol, value: token.address }));
    }, [paymentTokens]);

    // GET CHOSEN METHOD
    const chosenPayment = useMemo(() => {
        return {
            symbol: watch('payment')?.symbol,
            balance: watch('payment')?.userBalance,
            contract: watch('payment')?.contract,
            address: watch('payment')?.address,
            usdValue: watch('payment')?.usdValue,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentTokens, watch('payment')]);

    console.log(chosenPayment);

    /* --------------------------------------------- 
              DONATION FUNCTION
     --------------------------------------------- */
    const { write: web3Donate } = useContractWrite({
        address: contract?.address,
        abi: abi,
        functionName: 'pledge',
        onSuccess() {
            setTimeout(() => {
                setTransactionLoading(false);
                loadAllCampaigns(campaignContract, campaignContractAbi);
                setDonationCount();
                setDonateModalStatus(false);
                toast.success('Thank you for your donation');
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
              APPROVE SENDING TOKEN
     --------------------------------------------- */
    const { write: web3ApproveTransfer, data: txData } = useContractWrite({
        address: chosenPayment?.address,
        abi: TokenAbi,
        functionName: 'approve',

        onSuccess() {
            setTransactionLoading(true);
        },
        onMutate() {
            setTransactionLoading(true);
        },
        onError(error) {
            setTransactionLoading(false);
            toast.error('Oops, Something went wrong!');
        },
    });

    /* --------------------------------------------- 
          LISTEN FOR APPROVING TRANSFER TRANSACTION
    --------------------------------------------- */
    useEffect(() => {
        if (txData) {
            async function getTx() {
                const waitFrTx = await waitForTransaction({
                    hash: txData?.hash,
                });
                setApprovedTx(waitFrTx);
            }

            getTx();
        }
    }, [txData]);

    /* ----------------------------------------------------- 
          FIRE THE DONATION FUNCTION ON APPROVE SUCCESS
    ----------------------------------------------------- */
    useEffect(() => {
        if (approvedTx) {
            web3Donate({
                recklesslySetUnpreparedArgs: [
                    donateModalSrc?.id,
                    Web3.utils.toWei(donationAmount.toString(), 'ether'),
                    chosenPayment?.address,
                    usdDonationAmount,
                ],
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [approvedTx]);

    /* ------------------------------------------------------- 
          APPROVE TO TRANSFER THE DONATION AMOUNt oN CLICK
    ------------------------------------------------------- */
    function donationHandler(data) {
        setDontationAmount(Number(data?.amount) / chosenPayment?.usdValue);
        setUSDDonationAmount(Web3?.utils.toWei(data?.amount.toString(), 'gwei'));
        const formattedAmount = Number(data?.amount) / chosenPayment?.usdValue;
        web3ApproveTransfer({
            recklesslySetUnpreparedArgs: [contract.address, Web3.utils.toWei(formattedAmount.toString(), 'ether')],
        });
    }

    return (
        <>
            <Popup closeModal={setDonateModalStatus} containerClass='col-lg-6'>
                <header className='text-center mb-4'>
                    <h2>Donate</h2>
                    <p className='text-muted'>Choose a payment method and an amount for your donation</p>
                </header>

                <form onSubmit={handleSubmit(donationHandler)}>
                    <div className='row g-3'>
                        <div className='col-12'>
                            <label htmlFor='paymentMethod' className='form-label'>
                                Payment Method
                            </label>
                            <Controller
                                name='payment'
                                control={control}
                                rules={{ required: 'Please select a payment method' }}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            options={paymentMethods}
                                            id='payment'
                                            className={`border-0 shadow-sm ${errors.payment ? 'is-invalid' : ''}`}
                                            classNamePrefix='select'
                                            placeholder='Select'
                                            isSearchable={true}
                                            formatOptionLabel={formatOptionLabel}
                                            {...field}
                                        />
                                        {errors.payment && (
                                            <span className='invalid-feedback'>{errors.payment?.message}</span>
                                        )}
                                    </>
                                )}
                            />
                        </div>

                        <div className='col-12'>
                            <label className='form-label' htmlFor='amount'>
                                Amount - USD
                            </label>
                            <input
                                type='number'
                                step='0.1'
                                className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                                id='amount'
                                placeholder='Enter donation ammount in USD'
                                name='amount'
                                disabled={Number(chosenPayment?.balance) === 0}
                                {...register('amount', {
                                    required: {
                                        value: true,
                                        message: 'Enter donation ammount in USD',
                                    },
                                    min: {
                                        value: 0.1,
                                        message: 'Please at least enter 0.1 USD',
                                    },
                                    max: {
                                        value: 1000000,
                                        message: 'Max donation amount is 1000000 USD at a time',
                                    },
                                })}
                            />
                            {chosenPayment?.balance && (
                                <p className='mb-0 small text-sm text-muted mt-2'>
                                    Your token balance is{' '}
                                    <span className='text-primary'>
                                        {chosenPayment?.balance} {chosenPayment?.symbol}
                                    </span>
                                </p>
                            )}
                            {errors.amount && <span className='invalid-feedback'>{errors.amount?.message}</span>}
                        </div>

                        <div className='col-12'>
                            {Number(chosenPayment?.balance) > 0 && (
                                <button className='btn btn-primary w-100' type='submit'>
                                    Donate
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </Popup>
        </>
    );
}

export default DonatePopup;
