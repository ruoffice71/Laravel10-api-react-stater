import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function PostForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [post, setPost] = useState({
      id: null,
      user_id: '',
      title: '',
      details: ''
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const {user, setNotification} = useStateContext()

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/posts/${id}`)
            .then(({data}) => {
                setLoading(false)
                setPost(data)
            })
            .catch(() => {
                setLoading(false)
            })
        }, [])
    }

    const onSubmit = ev => {
        ev.preventDefault()
        post.user_id=user.id;
        if (post.id) {
            axiosClient.put(`/posts/${post.id}`, post)
            .then(() => {
                setNotification('Post was successfully updated')
                navigate('/posts')
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
        } else {
            axiosClient.post('/posts', post)
            .then(() => {
                setNotification('Post was successfully created')
                navigate('/posts')
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
        }
    }

    return (
        <>
      {post.id && <h1>Update Post: {post.title}</h1>}
      {!post.id && <h1>New Post</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <input value={post.title} onChange={ev => setPost({...post, title: ev.target.value})} placeholder="Title"/>
            <input value={post.details} onChange={ev => setPost({...post, details: ev.target.value})} placeholder="Details"/>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
