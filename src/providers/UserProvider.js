import React, { useReducer } from 'react';
import { readContract } from '@wagmi/core';

import UserContext from './user-context';

const defaultUserState = {
    userContract: null,
    userContractAbi: null,
    registerIndicator: false,
    isRegistered: false,
    userInfo: {},
    usersList: [],
    activity: [],
};

const userReducer = (state, action) => {
    if (action.type === 'CONTRACT') {
        return {
            ...state,
            userContract: action.userContract,
        };
    }

    if (action.type === 'GET_ABI') {
        return {
            ...state,
            userContractAbi: action.userContractAbi,
        };
    }

    if (action.type === 'GET_ACTIVITY') {
        return {
            ...state,
            activity: action.activity
                ?.map((item) => {
                    return {
                        user: item[0],
                        time: Number(item[2]) * 1000,
                        status: item[3],
                    };
                })
                ?.sort((a, b) => b.time - a.time),
        };
    }

    if (action.type === 'USER_INFO') {
        return {
            ...state,
            isRegistered: action?.userInfo[1] !== '0x0000000000000000000000000000000000000000' ? true : false,
            userInfo:
                action?.userInfo[1] !== '0x0000000000000000000000000000000000000000'
                    ? {
                          index: Number(action?.userInfo[0]),
                          address: action?.userInfo[1],
                          name: action?.userInfo[2],
                          email: action?.userInfo[3],
                          code: action?.userInfo[4],
                          verified: true,
                          location: action?.userInfo[6],
                          profile: action?.userInfo[7],
                          phone: action?.userInfo[8],
                      }
                    : {},
        };
    }

    if (action.type === 'USERS_LIST') {
        return {
            ...state,
            usersList: action.usersList?.map((user) => {
                return {
                    index: Number(user[0]),
                    address: user[1],
                    name: user[2],
                    email: user[3],
                    code: user[4],
                    verified: true,
                    location: user[6],
                    profile: user[7],
                    phone: user[8],
                };
            }),
        };
    }

    if (action.type === 'SET_REGISTER_INDICATOR') {
        return {
            ...state,
            registerIndicator: action.registerIndicator,
        };
    }

    return defaultUserState;
};

const UserProvider = (props) => {
    const [userState, dispatchUserAction] = useReducer(userReducer, defaultUserState);

    const loadContractHandler = (userContract) => {
        dispatchUserAction({ type: 'CONTRACT', userContract: userContract });
        return userContract;
    };

    const getUserContractAbiHandler = (abi) => {
        dispatchUserAction({ type: 'GET_ABI', userContractAbi: abi });
    };

    const loadUserInfoHandler = async (contract, address) => {
        const userInfo = await readContract({
            address: contract.address,
            abi: userState.userContractAbi,
            functionName: 'getUser',
            overrides: address,
        });
        dispatchUserAction({ type: 'USER_INFO', userInfo: userInfo });

        return userInfo;
    };

    const loadUsersListHandler = async (contract) => {
        const usersList = await readContract({
            address: contract.address,
            abi: userState.userContractAbi,
            functionName: 'getAllUsers',
        });
        dispatchUserAction({ type: 'USERS_LIST', usersList: usersList });
        return usersList;
    };

    const loadActivitiesHandler = async (contract, abi) => {
        const activities = await readContract({
            address: contract.address,
            abi: abi,
            functionName: 'activityLogs',
        });

        dispatchUserAction({ type: 'GET_ACTIVITY', activity: activities });
        console.log(activities);
        return activities;
    };

    const setRegisterIndicatorHandler = async (state) => {
        dispatchUserAction({ type: 'SET_REGISTER_INDICATOR', registerIndicator: state });
    };

    const userContext = {
        userContract: userState.userContract,
        userInfo: userState.userInfo,
        usersList: userState.usersList,
        registerIndicator: userState.registerIndicator,
        isRegistered: userState.isRegistered,
        userContractAbi: userState.userContractAbi,
        activity: userState.activity,
        loadUserContract: loadContractHandler,
        getUserContractAbi: getUserContractAbiHandler,
        loadUserInfo: loadUserInfoHandler,
        loadUsersList: loadUsersListHandler,
        setRegisterIndicator: setRegisterIndicatorHandler,
        loadActivities: loadActivitiesHandler,
    };

    return <UserContext.Provider value={userContext}>{props.children}</UserContext.Provider>;
};

export default UserProvider;
