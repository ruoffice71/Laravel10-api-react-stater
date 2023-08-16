import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";

export default function UserForm() {
    const navigate = useNavigate();
    let { id } = useParams();
    const [selectAll, setSelectAll] = useState(false);

    // Create initial state for checkboxes
    const numberOfCheckboxes = 9; // You can change this to the desired number of checkboxes
    const initialState = {};
    for (let i = 1; i <= numberOfCheckboxes; i++) {
        initialState[`checkBox${i}`] = false;
    }
    const [checkBoxes, setCheckBoxes] = useState(initialState);

    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        checkBoxes:checkBoxes
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const { setNotification } = useStateContext()

    if (id) {
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({ data }) => {
                    setLoading(false)
                    setUser(data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = ev => {
        ev.preventDefault()
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
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
            axiosClient.post('/users', user)
                .then(() => {
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
                                        <legend>Personalia:</legend>
                                        <label className="checkbox_label" htmlFor="checkBox1">Select 1
                                            <input className="checkbox_input" type="checkbox" name="checkBox1" checked={checkBoxes.checkBox1} onChange={handleCheckBoxChange} />
                                        </label>
                                        <label className="checkbox_label" htmlFor="checkBox2">Select 2
                                            <input className="checkbox_input" type="checkbox" name="checkBox2" checked={checkBoxes.checkBox2} onChange={handleCheckBoxChange} />
                                        </label>
                                        <label className="checkbox_label" htmlFor="checkBox3">Select 3
                                            <input className="checkbox_input" type="checkbox" name="checkBox3" checked={checkBoxes.checkBox3} onChange={handleCheckBoxChange} />
                                        </label>
                                    </fieldset>
                                </div>
                                <div className="col-md-4 col-sm-6 col-12">
                                    <fieldset>
                                        <legend>Personalia:</legend>
                                        <label className="checkbox_label" htmlFor="checkBox4">Select 4
                                            <input className="checkbox_input" type="checkbox" name="checkBox4" checked={checkBoxes.checkBox4} onChange={handleCheckBoxChange} />
                                        </label>
                                        <label className="checkbox_label" htmlFor="checkBox5">Select 5
                                            <input className="checkbox_input" type="checkbox" name="checkBox5" checked={checkBoxes.checkBox5} onChange={handleCheckBoxChange} />
                                        </label>
                                        <label className="checkbox_label" htmlFor="checkBox6">Select 6
                                            <input className="checkbox_input" type="checkbox" name="checkBox6" checked={checkBoxes.checkBox6} onChange={handleCheckBoxChange} />
                                        </label>
                                    </fieldset>
                                </div>
                                <div className="col-md-4 col-sm-6 col-12">
                                    <fieldset>
                                        <legend>Personalia:</legend>
                                        <label className="checkbox_label" htmlFor="checkBox7">Select 7
                                            <input className="checkbox_input" type="checkbox" name="checkBox7" checked={checkBoxes.checkBox7} onChange={handleCheckBoxChange} />
                                        </label>
                                        <label className="checkbox_label" htmlFor="checkBox8">Select 8
                                            <input className="checkbox_input" type="checkbox" name="checkBox8" checked={checkBoxes.checkBox8} onChange={handleCheckBoxChange} />
                                        </label>
                                        <label className="checkbox_label" htmlFor="checkBox9">Select 9
                                            <input className="checkbox_input" type="checkbox" name="checkBox9" checked={checkBoxes.checkBox9} onChange={handleCheckBoxChange} />
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
