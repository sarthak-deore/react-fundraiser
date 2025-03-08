import React, { useReducer } from 'react';
import { readContract } from '@wagmi/core';
import Integration from '../integration/TokenAbi.json';
import { getContract } from '@wagmi/core';
import Web3 from 'web3';

import AppContext from './app-context';

const defaultAppState = {
    contract: null,
    abi: null,
    owner: '',
    paymentTokens: [],
    donateModalStatus: false,
    donateModalSrc: {},
    themeMode: 'dark',
    activities: [],
    mintUploadProgress: 0,
    transactionLoading: false,
    uploadingProgress: false,
    donationCount: 0,
};

const appReducer = (state, action) => {
    if (action.type === 'SWITCHMODE') {
        return {
            ...state,
            themeMode: action.themeMode,
        };
    }
    if (action.type === 'CONTRACT') {
        return {
            ...state,
            contract: action.contract,
        };
    }
    if (action.type === 'DONATE_MODAL_STATUS') {
        return {
            ...state,
            donateModalStatus: action.status,
        };
    }
    if (action.type === 'DONATE_MODAL_SRC') {
        return {
            ...state,
            donateModalSrc: action.src,
        };
    }
    if (action.type === 'GET_ABI') {
        return {
            ...state,
            abi: action.abi,
        };
    }
    if (action.type === 'LOADING') {
        return {
            ...state,
            transactionLoading: action.loading,
        };
    }
    if (action.type === 'UPLOADING_PROGRESS') {
        return {
            ...state,
            uploadingProgress: action.loading,
        };
    }
    if (action.type === 'DONATION_COUNT') {
        return {
            ...state,
            donationCount: state.donationCount + 1,
        };
    }

    if (action.type === 'GET_UPLOAD_PROGRESS') {
        return {
            ...state,
            mintUploadProgress: action.progress,
        };
    }
    if (action.type === 'GET_OWNER') {
        return {
            ...state,
            owner: action.owner,
        };
    }
    if (action.type === 'GET_PAYMENT_TOKENS') {
        return {
            ...state,
            paymentTokens: action.paymentTokens,
        };
    }
    if (action.type === 'LOAD_ACTIVITIES') {
        return {
            ...state,
            activities: action.activities.map((el) => {
                return {
                    userAddress: el[0],
                    userName: el[1][0],
                    userProfile: el[1][3],
                    time: Number(el[2]) * 1000,
                    action: el[3],
                };
            }),
        };
    }

    return defaultAppState;
};

const AppProvider = (props) => {
    const [appState, dispatchAppAction] = useReducer(appReducer, defaultAppState);

    const setTransactionLoadingHandler = (loading) => {
        dispatchAppAction({ type: 'LOADING', loading: loading });
    };

    const switchModeHandler = (themeMode) => {
        dispatchAppAction({ type: 'SWITCHMODE', themeMode: themeMode });
    };

    const setDonateModalStatusHandler = (status) => {
        dispatchAppAction({ type: 'DONATE_MODAL_STATUS', status: status });
    };

    const setDonateModalSrcHandler = (src) => {
        dispatchAppAction({ type: 'DONATE_MODAL_SRC', src: src });
    };

    const setUploadingProgressHandler = (loading) => {
        dispatchAppAction({ type: 'UPLOADING_PROGRESS', loading: loading });
    };

    const getContractAbiHandler = (abi) => {
        dispatchAppAction({ type: 'GET_ABI', abi: abi });
    };

    const loadContractHandler = (contract) => {
        dispatchAppAction({ type: 'CONTRACT', contract: contract });
        return contract;
    };

    const loadAppOwnerHandler = async (contract, abi) => {
        const owner = await readContract({
            address: contract.address,
            abi: abi,
            functionName: 'admin',
        });
        dispatchAppAction({ type: 'GET_OWNER', owner: owner });
        return owner;
    };

    const loadActivitiesHandler = async (contract, abi) => {
        const activities = await readContract({
            address: contract.address,
            abi: abi,
            functionName: 'actvityLogs',
        });

        dispatchAppAction({ type: 'LOAD_ACTIVITIES', activities: activities });
        return activities;
    };

    const setDonationCountHandler = () => {
        dispatchAppAction({ type: 'DONATION_COUNT' });
    };

    const loadMintUploadProgressHandler = (progress) => {
        dispatchAppAction({ type: 'GET_MINT_PROGRESS', progress: progress });
        return progress;
    };

    const loadPaymentTokensHandler = async (contract, abi, account) => {
        const paymentTokens = await readContract({
            address: contract.address,
            abi: abi,
            functionName: 'getTokens',
        });

        const tokensInUsd = await readContract({
            address: contract.address,
            abi: abi,
            functionName: 'getTokenPriceInUSDT',
        });

        const formattedTokensInUsd = tokensInUsd?.map((el) => {
            return {
                address: el[0],
                value: el[1],
            };
        });

        const paymentTokensAddress = paymentTokens?.map((token) => {
            return {
                tokenAddress: token,
                tokenContract: getContract({
                    address: token,
                    abi: Integration,
                }),
            };
        });

        const getSymbol = (arr) => {
            const promises = arr?.map(async (item) => {
                return {
                    address: item.tokenAddress,
                    contract: item.tokenContract,
                    symbol: await readContract({
                        address: item.tokenAddress,
                        abi: Integration,
                        functionName: 'symbol',
                    }),
                    usdValue: formattedTokensInUsd?.filter((el) => el?.address === item.tokenAddress)[0]?.value || '0',
                    name: await readContract({
                        address: item.tokenAddress,
                        abi: Integration,
                        functionName: 'name',
                    }),
                    decimals: await readContract({
                        address: item.tokenAddress,
                        abi: Integration,
                        functionName: 'decimals',
                    }),
                    userBalance: Web3.utils.fromWei(
                        Number(
                            await readContract({
                                address: item.tokenAddress,
                                abi: Integration,
                                functionName: 'balanceOf',
                                args: [account],
                            })
                        )
                            .toLocaleString('fullwide', { useGrouping: false })
                            .toString(),
                        'ether'
                    ),
                };
            });

            return Promise.all(promises);
        };

        dispatchAppAction({ type: 'GET_PAYMENT_TOKENS', paymentTokens: await getSymbol(paymentTokensAddress) });
        return paymentTokens;
    };

    const appContext = {
        contract: appState.contract,
        abi: appState.abi,
        themeMode: appState.themeMode,
        paymentTokens: appState.paymentTokens,
        owner: appState.owner,
        mintUploadProgress: appState.mintUploadProgress,
        transactionLoading: appState.transactionLoading,
        uploadingProgress: appState.uploadingProgress,
        activities: appState.activities,
        donateModalStatus: appState.donateModalStatus,
        donateModalSrc: appState.donateModalSrc,
        donationCount: appState.donationCount,
        loadContract: loadContractHandler,
        loadAppOwner: loadAppOwnerHandler,
        setTransactionLoading: setTransactionLoadingHandler,
        loadMintUploadProgress: loadMintUploadProgressHandler,
        setUploadingProgress: setUploadingProgressHandler,
        loadActivities: loadActivitiesHandler,
        switchMode: switchModeHandler,
        getContractAbi: getContractAbiHandler,
        loadPaymentTokens: loadPaymentTokensHandler,
        setDonateModalStatus: setDonateModalStatusHandler,
        setDonateModalSrc: setDonateModalSrcHandler,
        setDonationCount: setDonationCountHandler,
    };

    return <AppContext.Provider value={appContext}>{props.children}</AppContext.Provider>;
};

export default AppProvider;
