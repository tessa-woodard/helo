import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'

import noImage from './no_image.jpg'
import './Post.css'

class Post extends Component {
    constructor(props) {
        super(props)
        this.state = {
            author: '',
            profile_pic: '',
            title: '',
            img: '',
            content: '',
        }
        this.delete = this.delete.bind(this)
    }

    componentDidMount() {
        axios.get(`/api/Post/${this.props.match.params.id}`).then((res) => {
            this.setState({ ...res.data[0] });
        })
    }

    delete() {
        axios.delete(`/api/Post/${this.props.match.params.id}`).then((res) => {
            this.props.history.push('/dashboard')
        })
    }

    render() {
        let imgSrc = this.state.img ? this.state.img : noImage
        return (
            <div className='Post content_box'>
                {this.state.title
                    ?
                    <div>
                        <div className='post_header'>
                            <h2 className='title'>{this.state.title}</h2>
                            <div className='author_box'>
                                <p>by {this.state.username}</p>
                                <img src={`https://robohash.org/${this.state.username}`} alt='author' />
                            </div>
                        </div>
                        <div className='post_content_box'>
                            <div className='post_img' style={{ backgroundImage: `url('${imgSrc}') ` }} alt='post' ></div>
                            <p>{this.state.content}</p>
                        </div>
                    </div>
                    :
                    <div className='oops_box'>
                        <h2 className='title'>Oops!</h2>
                        <p>Looks like this post doesn't exist anymore</p>
                    </div>
                }
                <div className='delete'>
                    <button onClick={this.delete} className='black_button'>Delete</button>
                </div>

            </div>
        )
    }
}

const mapStateToProps = reduxState => reduxState

export default connect(mapStateToProps)(Post)