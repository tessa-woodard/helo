import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { updateUser } from './../../ducks/reducer'

import logo from './helo_logo.png'
import './Auth.css'

class Auth extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        }
        this.login = this.login.bind(this)
        this.register = this.register.bind(this)
    }
    handleChange(prop, val) {
        if (val.length < 12) {
            this.setState({
                [prop]: val
            })
        }
    }
    login = (e) => {
        const { username, password } = this.state
        axios
            .post('/auth/login', { username, password })
            .then(res => {
                this.props.updateUser(res.data)
                this.props.history.push('/dashboard')
            })
            .catch((err) => {
                alert(err.message)
            })
    }
    register = () => {
        const { username, password } = this.state
        axios
            .post('/auth/register', { username, password })
            .then(res => {
                this.props.updateUser(res.data)
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
                        <input value={this.state.username} onChange={e => this.handleChange('username', e.target.value)} />
                    </div>
                    <div className='auth_input_box'>
                        <p>Password:</p>
                        <input value={this.state.password} type='password' onChange={e => this.handleChange('password', e.target.value)} />
                    </div>
                    <div className='auth_button_container'>
                        <button className='black_button' onClick={(e) => { this.login() }}> Login </button>
                        <button className='black_button' onClick={(e) => { this.register() }}> Register </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(null, { updateUser })(Auth)