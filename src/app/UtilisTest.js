import axios, { AxiosInstance } from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { nkey } from './keys/keyStore';
import Utils from './Utils';

const api = axios.create();

api.interceptors.request.use(async config => {

    const token = await Utils.ngetStorage(nkey.access_token) // token từ lấy từ api get user
    if (token) {  // nếu token có thì config vô header
        config.headers.Authorization = 'Bearer' + token;
    }
    return config;
})

// api.interceptors.response.use(
//     response => {
//         return Promise.resolve({
//             status: 1,
//             ...response.data
//         })
//     }, error => {
//         const originalRequest = error.config;
//         if (originalRequest.url === 'https://identityserver.jee.vn/user/refresh') {
//             return Promise.reject(error);
//         }
//         if (response.status === 401 && error.response.data.message === 'Unauthorized') {
//             let refreshToken = await Utils.ngetStorage(nkey.refresh_token)


//             let data = await api.post('https://identityserver.jee.vn/user/refresh', null, {
//                 headers: {
//                     Authorization: 'Bearer ' + refreshToken
//                 }
//             })
//             if (data.status === 200) {
//                 await Utils.nsetStorage(nkey.token, data.access_token);
//                 await Utils.nsetStorage(nkey.refresh_token, data.refresh_token);
//                 originalRequest.headers.Authorization = 'Bearer ' + data.access_token;
//                 return api(originalRequest)
//             }

//         }
//     }
// )

export default api;
