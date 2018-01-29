import React, { Component } from 'react'
import {Button,Form, Segment, Loader} from 'semantic-ui-react'
import {BrowserRouter, Route, Link, Redirect} from 'react-router-dom'
import axios from 'axios'
import Login from './components/Login'
import Signup from './components/Signup'
import Todo from './components/Todo';
import Private from './components/Private'
const Test = (props) => <h1 style={{color: 'black'}}>{props.text}</h1>
class App extends Component {
  constructor(props){
    super(props)
    this.state = { token: '', auth: false, user: {name: '', email: '', _id: ''}}
  }
  componentWillMount(){
    this.checkAuth()
  }
  handleAuthChange = (auth)=>{
    this.setState({auth})
  }
  handleLogout = ()=>{
    window.localStorage.removeItem('token')
    this.checkAuth()
  }
  checkAuth = ()=>{
    // check auth state for the server
    let token = window.localStorage.getItem('token')
    if(token) {
      axios.get('/auth/check',{headers: {
        "Authorization" : token
      }
    }).then(res=>{
      console.log(res)
      if(res.data.user){
        this.setState({user: res.data.user, auth: true})
      }
    })
    } else {
      this.setState({auth: false, user: {name: '', email: '', _id: ''} }, ()=>{
      })
    }
  }
  render() {
    return (
      <BrowserRouter>
        <div style={{background: '#2c3e50', height: '100vh', width: '100vw', color: 'white', display: 'flex', flexDirection:'column'}}>
          <div id='header' style={{flex: 1, maxHeight: 50, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <h1>Full-Stack Todo</h1>
          </div>
          <div id='container'
          style={{flex: 9, background: '#ecf0f1', borderRadius: '10px',
          width: '90%', alignSelf: 'center', display: 'flex',
          justifyContent: 'flex-start', alignItems: 'center',flexDirection: 'column'}}>
            <div id='info' style={{width: '100%', flex: 1,borderRadius: '10px', color: 'black'}} >
              {this.state.auth ? <div style={{float: 'right'}}>
                <h1 style={{display: 'inline-block', paddingRight: '10px', verticalAlign: '-webkit-baseline-middle'}}>{this.state.user.name}</h1>
                <Button onClick={this.handleLogout} color='red'>logout</Button>
              </div>: null}
            </div>
            <div id='content' style={{width: '100%', flex: 10, display: 'flex', justifyContent: 'center' }}>
            <Route exact path='/' render={(props)=><Login props={props} checkAuth={this.checkAuth} auth={this.state.auth}/>}/>
            <Route exact path='/signup' render={(props)=><Signup props={props} checkAuth={this.checkAuth} auth={this.state.auth}/>}/>
            <Private path="/todo" user={this.state.user} auth={this.state.auth} component={Todo}/>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
