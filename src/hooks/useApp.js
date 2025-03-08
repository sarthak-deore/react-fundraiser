import { useContext } from 'react';
import AppContext from '../providers/app-context';

const useApp = () => {
    return useContext(AppContext);
};

export default useApp;
