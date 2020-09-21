
import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import noImage from './no_image.jpg'
import './Form.css'

class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            img: '',
            content: ''
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        })
    }

    handleSubmit() {
        axios.post(`/api/posts/`, this.state)
            .then((e) => this.props.history.push('/dashboard'))
    }

    render() {
        let imgSrc = this.state.img ? this.state.img : noImage;
        return (
            <div className='Form content_box'>
                <h2 className='title'>New Post</h2>
                <div className='form_input_box'>
                    <p>Title:</p>
                    <input name="title" onChange={this.handleChange} />
                </div>
                <div className='form_img_prev' style={{ backgroundImage: `url('${imgSrc}')` }} alt='preview' ></div>
                <div className='form_input_box'>
                    <p>Image URL:</p>
                    <input name="img" onChange={this.handleChange} />
                </div>
                <div className='form_text_box'>
                    <p>Content:</p>
                    <input name="content" onChange={this.handleChange} />
                </div>
                <button onClick={this.handleSubmit} className='black_button form_button'>Post</button>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        userId: state.userId
    }
}
export default connect(mapStateToProps)(Form)