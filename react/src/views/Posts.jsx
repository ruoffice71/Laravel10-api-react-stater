import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function Posts() {
  const [posts, setPosts] = useState([]);
//   console.log('jgffjhfhujf',posts);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getPosts();
  }, [])

  const onDeleteClick = post => {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return
    }
    axiosClient.delete(`/posts/${post.id}`)
      .then(() => {
        setNotification('Post was successfully deleted')
        getPosts()
      })
  }

  const getPosts = () => {
    setLoading(true)
    axiosClient.get('/posts')
      .then(({ data }) => {
        setLoading(false)
        setPosts(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Posts</h1>
        <Link className="btn-add" to="/posts/new">Add new</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>UserId</th>
            <th>Title</th>
            <th>Details</th>
            <th>Create Date</th>
            <th>Actions</th>
          </tr>
          </thead>
          {loading &&
            <tbody>
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
            {posts.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.user_name}</td>
                <td>{p.title}</td>
                <td>{p.details}</td>
                <td>{p.created_at}</td>
                <td>
                  <Link className="btn-edit" to={'/posts/' + p.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(p)}>Delete</button>
                </td>
              </tr>
            ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
