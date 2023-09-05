import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function UserForm() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [selectAll, setSelectAll] = useState(false);

    // Create initial state for checkboxes
    // const numberOfCheckboxes = 5; // You can change this to the desired number of checkboxes
    const initialState = {};
    initialState[`users_list`] = false;
    initialState[`users_view`] = false;
    initialState[`users_create`] = false;
    initialState[`users_update`] = false;
    initialState[`users_delete`] = false;
    // for (let i = 1; i <= numberOfCheckboxes; i++) {
    //     initialState[`checkBox${i}`] = false;
    // }
    const [checkBoxes, setCheckBoxes] = useState(initialState);

    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const { setNotification } = useStateContext()

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    const permissionArray=data.permissions;
                    permissionArray.forEach(element => {
                        checkBoxes[element]=true;
                    });
                    setLoading(false)
                    setUser(data)
                    setCheckBoxes(checkBoxes)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = ev => {
        ev.preventDefault()
        const userData = { user, checkBoxes };
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, userData)
                .then((response) => {
                    console.log(response.data);
                    setNotification('User was successfully updated')
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post('/users', userData)
                .then((response) => {
                    console.log(response.data.data);
                    setNotification('User was successfully created')
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    }


    // Checknox form handel start--------------------------

    const handleSelectAllChange = (event) => {
        const isChecked = event.target.checked;
        setSelectAll(isChecked);
        setCheckBoxes((prevCheckBoxes) => {
            const updatedCheckBoxes = {};
            for (const checkBox in prevCheckBoxes) {
                updatedCheckBoxes[checkBox] = isChecked;
            }
            return updatedCheckBoxes;
        });
    };

    const handleCheckBoxChange = (event) => {
        const checkBoxName = event.target.name;
        const isChecked = event.target.checked;
        setCheckBoxes((prevCheckBoxes) => ({
            ...prevCheckBoxes,
            [checkBoxName]: isChecked,
        }));

        const areAllChecked = Object.values({
            ...checkBoxes,
            [checkBoxName]: isChecked,
        }).every((value) => value === true);
        setSelectAll(areAllChecked);
    };
    // Checknox form handel end--------------------------
    return (
        <>
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
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
                        <input value={user.name} onChange={ev => setUser({ ...user, name: ev.target.value })} placeholder="Name" />
                        <input value={user.email} onChange={ev => setUser({ ...user, email: ev.target.value })} placeholder="Email" />
                        <input type="password" onChange={ev => setUser({ ...user, password: ev.target.value })} placeholder="Password" />
                        <input type="password" onChange={ev => setUser({ ...user, password_confirmation: ev.target.value })} placeholder="Password Confirmation" />

                        <hr />
                        <h1>Roles & Permission</h1>
                        <div className="container">
                            <div className="row">
                                <label className="checkbox_label" htmlFor="selectAll">Select All
                                    <input className="checkbox_input" type="checkbox" checked={selectAll} onChange={handleSelectAllChange} />
                                </label>
                                <div className="col-md-4 col-sm-6 col-12">
                                    <fieldset>
                                        <legend>User Read:</legend>
                                        <label className="checkbox_label" htmlFor="users_list">List
                                            <input className="checkbox_input" type="checkbox" name="users_list" checked={checkBoxes.users_list} onChange={handleCheckBoxChange} />
                                        </label>
                                        <label className="checkbox_label" htmlFor="users_view">View
                                            <input className="checkbox_input" type="checkbox" name="users_view" checked={checkBoxes.users_view} onChange={handleCheckBoxChange} />
                                        </label>
                                    </fieldset>
                                </div>
                                <div className="col-md-4 col-sm-6 col-12">
                                    <fieldset>
                                        <legend>User Write:</legend>
                                        <label className="checkbox_label" htmlFor="users_create">Create
                                            <input className="checkbox_input" type="checkbox" name="users_create" checked={checkBoxes.users_create} onChange={handleCheckBoxChange} />
                                        </label>
                                        <label className="checkbox_label" htmlFor="users_update">Update
                                            <input className="checkbox_input" type="checkbox" name="users_update" checked={checkBoxes.users_update} onChange={handleCheckBoxChange} />
                                        </label>
                                    </fieldset>
                                </div>
                                <div className="col-md-4 col-sm-6 col-12">
                                    <fieldset>
                                        <legend>User Delete:</legend>
                                        <label className="checkbox_label" htmlFor="users_delete">Delete
                                            <input className="checkbox_input" type="checkbox" name="users_delete" checked={checkBoxes.users_delete} onChange={handleCheckBoxChange} />
                                        </label>
                                    </fieldset>
                                </div>
                            </div>
                        </div>


                        <br /><br />
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    )
}
