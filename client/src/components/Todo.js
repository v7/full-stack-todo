import React, { Component } from 'react'
import {Button,Form, Segment, Input, List, Image} from 'semantic-ui-react'
import axios from 'axios'
class Todo extends Component {
  constructor(props){
    super(props)
    this.state = {
      list: [],
      text: ''
    }
  }
  componentDidMount(){
    this.getList()
  }
  getList = ()=> {
    // get the list filter it to show only not finished
    let token = window.localStorage.getItem('token')
    axios.get('/api/todos',{headers: {
      "Authorization" : token
    }
  }).then(res=>{
    console.log(res)
    let list = res.data.todos.filter(todo=> !todo.status)
    this.setState({list})
  })
  }
  handleTextChange = (event)=>{
    this.setState({text: event.target.value})
  }
  handleEnter = (event) =>{
    if(event.key=== 'Enter') {
      // send text to backend
      let token = window.localStorage.getItem('token')
      let list = this.state.list
      let text = this.state.text
      this.setState({text: ''})
      axios.post('/api/todos',{text, status: false},{headers: {
        "Authorization" : token
      }
    }).then(res => {
      if(res.data.todo){
        list.push(res.data.todo)
        this.setState({list})
      }
    })
    }
  }
  handleDone = (_id, index) => {
    let token = window.localStorage.getItem('token')
    axios.post('/api/todos/'+ _id,{status: true},{headers: {
      "Authorization" : token
    }
  }).then(res => {
    if(res.data.update){
      let list = this.state.list
      list[index].status = true
      let fList = list.filter(todo=> !todo.status)
      this.setState({list: fList})
    }
  })
  }
  render () {
    return (
      <div style={{width: '40vw', minWidth: 300, maxWidth: 600}}>
      <Input onKeyPress={this.handleEnter} placeholder='Be awesome' value={this.state.text} onChange={this.handleTextChange} size='huge' style={{width: '100%'}} />
      <List celled style={{color: 'black'}} verticalAlign='middle'>
        {this.state.list.map((todo, index) => {
          return (
            <List.Item key={todo._id} >
            <List.Content floated='right'>
              <Button onClick={()=> this.handleDone(todo._id, index)} >Done</Button>
            </List.Content>
            <List.Content>
              {todo.text}
            </List.Content>
          </List.Item>
          )
        })}
      </List>
      </div>
    )
  }
}

export default Todo