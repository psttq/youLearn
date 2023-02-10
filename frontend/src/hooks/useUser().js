import {useDispatch, useSelector} from "react-redux";
import {selectUser, setUser} from "../redux/slices/userSlice";
import axios from "axios";
import {API_URL} from "../config";

export const useUser = async () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    if(user.user_id === undefined) {
        axios.get(`${ API_URL }/user-info`).then(res => dispatch(setUser(res.data)));
    }
    return user;
}