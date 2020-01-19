import React, { Component } from "react";
import http from './services/httpservice';
import config from './config.json'
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./App.css";

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    const { data } = await http.get(config.apiEndpoint);

    this.setState({posts: data})
  }

  handleAdd = async () => {
    const obj = { title: "a", body: "b"};
    const {data: response} = await http.post(config.apiEndpoint, obj);
    this.setState({posts: [response, ...this.state.posts]})
    console.log("Add Response: ", response);
  };

  handleUpdate = async post => {
    post.title = "Updated Example";
    const {data} = await http.put(config.apiEndpoint + '/' + post.id, post) //Updating the whole thing
   // http.patch(config.apiEndpoint = '/' + post.id, {title: post.title}) //Updating Specific Property
    console.log(data)

    const posts = this.state.posts;
    const index = posts.indexOf(post);
    posts[index] = {...post};
    this.setState({posts})
    console.log("Update", post);
  };

  handleDelete = async post => {
    //Pessimistic Update, if an error occurs during the call, the rest of the func wont execute
    //This implementation, is optimistic, giving the illusion of a fast ui by updating prematurely
    const prevPosts = this.state.posts;
    const posts = this.state.posts.filter(p => p.id !== post.id)
    this.setState({posts})

    try{
      const promise = await http.delete(config.apiEndpoint + '/' + post.id);
      console.log(promise)
    }
    catch(exception){
      if(exception.response && exception.response.status === 404)
        //Expected errors
        alert("The post doesn't exist or has already been deleted")
      this.setState({posts: prevPosts});
    }
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer />
        
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
