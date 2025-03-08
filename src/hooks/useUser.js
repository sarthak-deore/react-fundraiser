import { useContext } from 'react';
import UserContext from '../providers/user-context';

const useUser = () => {
    return useContext(UserContext);
};

export default useUser;
