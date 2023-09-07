import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function PostForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [image, setImage] = useState(null);
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
    

    const onSubmit = e => {
        e.preventDefault()
        post.user_id=user.id;

        // const postData = { post, image };
        const formData = new FormData();
        formData.append('user_id', post.user_id);
        formData.append('title', post.title);
        formData.append('details', post.details);
        if (image) {
            formData.append('image', image, image.name);
        }
        if (post.id) {
            formData.append('_method', 'PATCH');
            axiosClient.post(`/posts/${post.id}`, formData,{
                headers: {'Content-Type': 'multipart/form-data'}
            })
            .then((response) => {
                console.log(response.data);
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
            axiosClient.post('/posts', formData)
            .then((response) => {
                console.log(response.data);
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
          <form onSubmit={onSubmit} id="fileInput"  encType="multipart/form-data">
            <input value={post.title} onChange={e => setPost({...post, title: e.target.value})} placeholder="Title"/>
            <input value={post.details} onChange={e => setPost({...post, details: e.target.value})} placeholder="Details"/>
            <input type="file" onChange={e => setImage(e.target.files[0])} />
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
