import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { loginUser } from '../../ducks/reducer'

import logo from './helo_logo.png'
import './Auth.css'

class Auth extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: ''
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value,

        })
    }

    login = (e) => {
        const { username, password } = this.state
        axios
            .post('/auth/login', { username, password })
            .then(res => {
                this.props.loginUser(res.data)
                this.props.history.push('/dashboard')
            })
            .catch((err) => {
                alert(err.message)
            })
    }
    register = () => {
        const { username, password, profile_pic } = this.state
        axios
            .post('/auth/register', { username, password, profile_pic })
            .then(res => {
                this.props.loginUser(res.data)
                this.props.history.push('/dashboard')
            })
            .catch((err) => {
                alert(err.message)
            })
    }
    render() {
        return (
            <div className='Auth'>
                <div className='auth_container'>
                    <img src={logo} alt='logo' />
                    <h1 className='auth_title'>Helo</h1>
                    <div className='auth_input_box'>
                        <p>Username:</p>
                        <input name='username' onChange={(e) => { this.handleChange(e) }} />
                    </div>
                    <div className='auth_input_box'>
                        <p>Password:</p>
                        <input name='password' onChange={(e) => { this.handleChange(e) }} type='password' />
                    </div>
                    <div className='auth_button_container'>
                        <button className='black_button' onClick={() => { this.login() }}> Login </button>
                        <button className='black_button' onClick={() => { this.register() }}> Register </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, { loginUser })(Auth)