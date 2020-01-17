import React, { Component } from "react";
import axios from 'axios';
import "./App.css";

const endPoint = 'http://jsonplaceholder.typicode.com/posts';
class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    const { data } = await axios.get(endPoint);

    this.setState({posts: data})
  }

  handleAdd = async () => {
    const obj = { title: "a", body: "b"};
    const {data: response} = await axios.post(endPoint, obj);
    this.setState({posts: [response, ...this.state.posts]})
    console.log("Add Response: ", response);
  };

  handleUpdate = async post => {
    post.title = "Updated Example";
    const {data} = await axios.put(endPoint + '/' + post.id, post) //Updating the whole thing
   // axios.patch(endPoint = '/' + post.id, {title: post.title}) //Updating Specific Property
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
      await axios.delete(endPoint + '/' + post.id)
      throw new Error("test error")
    }
    catch(exception){
      if(exception.response && exception.response.status === 404)
        //Expected errors
        alert("The post has already been deleted")
      else{
        //Unexpected error, network crash, bugs, db down?
        console.log("logging error", exception)
        alert("An error occured while deleting")
      }
      this.setState({posts: prevPosts});
    }

    console.log("Delete", post);
  };

  render() {
    return (
      <React.Fragment>
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
