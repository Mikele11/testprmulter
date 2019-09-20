import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

export default class HeaderPanel extends Component {
  constructor() {
    super();
    this.state = {
      id: null,
      address: '',
      firstName: '',
      lastName: ''
    };
  }
  componentDidMount() {
    const email = localStorage.getItem('email');
    var user = {};
    user.email = 'mz1080@meta.ua'
    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.post(`/api/post/user`,  user )
      .then(res => {
        console.log('-----------', res.data)
        this.setState({ 
          address: res.data.address, 
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          id: res.data._id,
          avatar: res.data.avatar
        });
      })
      .catch((error) => {
          console.log('error',error)    
      });
  }

  render() {
    const {avatar} = this.state;
    return (
      <header className='Header'>
        <div className="container">
          <label className="btn-menu" htmlFor="hmt">
            <span className="first"></span>
            <span className="second"></span>
          </label>
          <ul className="hidden-menu">
            <li><img src={avatar} width="189" height="255" alt="lorem"/></li>
            <li><img src={`https://simplchat.herokuapp.com/${avatar}`} width="189" height="255" alt="lorem"/></li>
            <li><NavLink activeClassName="active" exact to="/">Главная</NavLink></li>
            <li><NavLink activeClassName="active" to="/profile">О профиле</NavLink></li>
          </ul>
        </div>
      </header>
    );
  }
}
