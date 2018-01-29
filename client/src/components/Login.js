import React, { Component } from 'react'
import {Button,Form, Segment, Message} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import axios from 'axios'
class Login extends Component {
  constructor(props){
    super(props)
    this.state = {email: '', password: '', message: ''}
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.auth){
      this.props.props.history.push('/todo')
    }
  }
  handleEmail = (event)=> {
    this.setState({email: event.target.value})
  }
  handlePassword = (event)=> {
    this.setState({password: event.target.value})
  }
  handleSubmit= ()=>{
    let user = {email: this.state.email, password: this.state.password}
    axios.post('auth/login',user).then(res => {
      if (res.data.message){
        this.setState({message: res.data.message})
      }else {
        window.localStorage.setItem('token', res.data.token)
        this.props.checkAuth()
      }
    })
  }
  render () {
    return (
      <Form onSubmit={this.handleSubmit} size='large' style={{width: '50vw', minWidth: 300,alignSelf: 'center'}}>
      <Segment stacked>
        <Form.Input
          fluid
          icon='mail outline'
          iconPosition='left'
          placeholder='E-mail address'
          type='email'
          required
          value={this.state.email}
          onChange={this.handleEmail}
        />
        <Form.Input
          fluid
          icon='lock'
          iconPosition='left'
          placeholder='Password'
          type='password'
          required
          value={this.state.password}
          onChange={this.handlePassword}
        />
        <Button style={{backgroundColor: '#2c3e50'}} secondary fluid size='large'>Login</Button>
        <Link to='/signup'>Signup</Link>
      </Segment>
      <Message
      error
      content={this.state.message}
      visible={this.state.message}
    />
    </Form>
    )
  }
}

export default Login