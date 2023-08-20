import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionUsersCreate, setPermissionUsersCreate] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const {setNotification} = useStateContext()
//   const {user, setUser} = useStateContext();

//   useEffect(() => {
//     axiosClient.get('/user')
//       .then(({data}) => {
//          setUser(data)
//       })
//   }, [])

  useEffect(() => {
    getUsers();
  }, [])

  const onDeleteClick = user => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return
    }
    axiosClient.delete(`/users/${user.id}`)
      .then(() => {
        setNotification('User was successfully deleted')
        getUsers()
      })
  }

  const getUsers = () => {
    setLoading(true)
    axiosClient.get('/users')
      .then(({ data }) => {
        setLoading(false)
        setUsers(data.users)
        setPermissionUsersCreate(data.permissionUsersCreate)
        setPermissions(data.permissions)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  return (
    <div>
      <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
        <h1>Users</h1>
        {permissions.includes('users_create') &&
            <Link className="btn-add" to="/users/new">Add New</Link>
        }
      </div>
      {permissions.includes('users_list') &&
        <div className="card animated fadeInDown">
            <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
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
                {users.map(u => (
                <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.created_at}</td>
                    <td>
                    {permissions.includes('users_update') &&
                        <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                    }
                    &nbsp;
                    {permissions.includes('users_delete') &&
                        <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                    }
                    </td>
                </tr>
                ))}
                </tbody>
            }
            </table>
        </div>
      }
    </div>
  )
}
