import React from 'react';

const AppContext = React.createContext({
    contract: null,
    owner: '',
    paymentTokens: [],
    themeMode: 'dark',
    activities: [],
    mintUploadProgress: 0,
    transactionLoading: false,
    uploadingProgress: false,
    abi: null,
    donateModalStatus: false,
    donationCount: 0,
    donateModalSrc: {},
    getContractAbi: () => {},
    loadContract: () => {},
    loadAppOwner: () => {},
    setTransactionLoading: () => {},
    loadMintUploadProgress: () => {},
    setUploadingProgress: () => {},
    loadActivities: () => {},
    switchMode: () => {},
    loadPaymentTokens: () => {},
    setDonateModalSrc: () => {},
    setDonateModalStatus: () => {},
    setDonationCount: () => {},
});

export default AppContext;
