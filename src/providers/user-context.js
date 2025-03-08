import React from 'react';

const UserContext = React.createContext({
    userContract: null,
    userInfo: {},
    usersList: [],
    activity: [],
    registerIndicator: false,
    isRegistered: false,
    userContractAbi: null,
    loadUserContract: () => {},
    getUserContractAbi: () => {},
    loadUserInfo: () => {},
    loadUsersList: () => {},
    setRegisterIndicator: () => {},
    loadActivities: () => {},
});

export default UserContext;
