import React, { Component } from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import searchLogo from './search_logo.png'
import './Dashboard.css'

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: [],
            search: "",
            myPosts: true,
        }
        this.reset = this.reset.bind(this)
        // this.getPosts = this.getPosts.bind(this)
    }

    componentDidMount() {
        this.getPosts()
    }

    getPosts = () => {
        let { search, myPosts } = this.state
        let url = "/api/posts/"

        if (myPosts && !search) {
            url += "?user_posts=true&search="
        } else if (!myPosts && search) {
            url += `?user_posts=false&search=${search}`
        } else if (myPosts && search) {
            url += `?user_posts=true&search=${search}`
        } else if (!myPosts && !search) {
            url += "?user_posts=false&search="
        }
        axios.get(url).then((res) => {
            this.setState({
                posts: res.data,
            })
        })
    }

    handleChange = (e) => {
        this.setState({
            search: e.target.value,
        })
    }

    reset() {
        // let { myPosts } = this.state
        let url = "/api/posts/"
        if (this.state.myPosts) {
            url += "?user_posts=true&search="
        }
        axios.get(url).then((res) => {
            this.setState({ posts: res.data, search: "" })
        })
    }

    render() {
        const mapPosts = this.state.posts.map((e) => {
            return (<Link to={`/Post/${e.id}`} key={e.id}>
                <div className='content_box dash_post_box'>
                    <h3>{e.title}</h3>
                    <div className='author_box'>
                        <p>by {e.username}</p>
                        <img src={e.profile_pic} alt='author' />
                    </div>
                </div>
            </Link>
            )
        })
        return (
            <div className='Dash'>
                <div className='content_box dash_filter'>
                    <div className='dash_search_box'>
                        <input onChange={(e) => this.handleChange(e)} className='dash_search_bar' placeholder='Search by Title' />
                        <img onClick={this.getPosts} className='dash_search_button' src={searchLogo} alt='search' />
                        <button onClick={this.reset} className='black_button' id='dash_reset'>Reset</button>
                    </div>
                    <div className='dash_check_box'>
                        <p>My Posts</p>
                        <input checked={this.state.myPosts} onChange={() => this.setState({ myPosts: !this.state.myPosts }, this.getPosts)} type='checkbox' />
                    </div>
                </div>
                <section className="post-box">{mapPosts}</section>
            </div>
        )
    }
}
function mapStateToProps(state) {
    return {
        userId: state.userId
    }
}
export default connect(mapStateToProps)(Dashboard)