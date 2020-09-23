import axios from 'axios'

const initialState = {
    username: '',
    id: 0,
    profile_pic: ''
}

const LOGIN_USER = 'LOGIN_USER'
const LOGOUT_USER = 'LOGOUT_USER'
const GET_USER = 'GET_USER'

export function loginUser(username, id) {
    return {
        type: LOGIN_USER,
        payload: {
            username: username,
            id: id,
        }
    }
}

export function logoutUser() {
    return {
        type: LOGOUT_USER,
        payload: null,
    }
}

export function getUser() {
    const payload = axios.get('/api/auth/user')

    return {
        type: GET_USER,
        payload: payload,
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_USER:
            const { username, id, profile_pic } = action.payload.username
            return { username, id, profile_pic }
        case LOGOUT_USER:
            return initialState
        case GET_USER + '_PENDING':
            return { ...state }
        case GET_USER + '_FULFILLED':
            return { username, id, profile_pic }
        case GET_USER + '_REJECTED':
            return initialState
        default:
            return initialState
    }
}