import { useState, useEffect } from "react";
import CreateUser from "./create-user/CreateUser";
import Pagination from "./pagination/Pagination";
import Search from './search/Search'
import UserList from "./user-list/UserList";
import DetailsUser from "./details-user/DetailsUser";
import DeleteUser from "./delete-user/DeleteUser";
import Spinner from "../spinner/Spinner";

export default function UserSection() {
    const [users, setUsers] = useState([]);

    const [showCreateForm, setShowUserForm] = useState(false);

    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [userDataDetails, setUserDataDetails] = useState({});

    const [showDeleteForm, setShowDeleteForm] = useState(false);
    const [deleteUserId, setDeleteUserId] = useState(null);

    const [showSpinner, setShowSpinner] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3030/jsonstore/users`);
                const data = await response.json();
                const dataArray = Object.values(data);
                setUsers(dataArray)
            } catch (err) {
                alert(err.message);
            } finally {
                setShowSpinner(false);
            }
        };
        fetchData();
    }, [])

    const openCreateUserFormHandler = () => {
        setShowUserForm(true);
    };

    const closeCreateUserFormHandler = () => {
        setShowUserForm(false);
    };

    const submitCreateUserHandler = async (event) => {
        event.preventDefault();

        setShowSpinner(true);

        try {
            const formData = new FormData(event.currentTarget);
            const userData = Object.fromEntries(formData);

            userData.createdAt = new Date();
            userData.updatedAt = new Date();

            const response = await fetch(`http://localhost:3030/jsonstore/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData)
            });
            const createdUser = await response.json();

            setShowUserForm(false);
            setUsers(oldUsers => [...oldUsers, createdUser]);

        } catch (err) {
            console.log(err);
            setShowUserForm(false);
        } finally {
            setShowSpinner(false);
        }
    }

    const openUserDetailsHandler = async (userId) => {
        setShowDetailsForm(true);

        const response = await fetch(`http://localhost:3030/jsonstore/users/${userId}`);
        const user = await response.json();

        setUserDataDetails(user);
    }

    const closeUserDetailsHandler = () => {
        setShowDetailsForm(false);
    }

    const openDeleteFormHandler = (userId) => {
        setShowDeleteForm(true);
        setDeleteUserId(userId);
    }

    const closeDeleteFormHandler = () => {
        setShowDeleteForm(false);
        setDeleteUserId(null);
    }

    const deleteUserHandler = async () => {
        try {
            const userId = deleteUserId;

            const res = await fetch(`http://localhost:3030/jsonstore/users/${userId}`, {
                method: "DELETE"
            });

            if (!res.ok) {
                throw new Error("Failed to delete user");
            }

            setUsers(oldUsers => oldUsers.filter((user) => user._id !== userId));

        } catch (err) {
            console.log(err.message)
        } finally {
            setShowDeleteForm(false);
            setDeleteUserId(null);
        }
    }

    return (
        <section className="card users-container">
            {showSpinner && <Spinner />}

            <Search />

            <UserList
                users={users}
                openUserDetailsHandler={openUserDetailsHandler}
                openDeleteFormHandler={openDeleteFormHandler}
            />

            {showDetailsForm && (
                <DetailsUser
                    user={userDataDetails}
                    closeDetailsForm={closeUserDetailsHandler}
                />
            )}

            {showDeleteForm && (
                <DeleteUser
                    closeDeleteForm={closeDeleteFormHandler}
                    deleteUser={deleteUserHandler}
                />
            )}

            {showCreateForm && (
                <CreateUser
                    onCreateUser={submitCreateUserHandler}
                    onCloseCreateForm={closeCreateUserFormHandler}
                />
            )}

            <button className="btn-add btn" onClick={openCreateUserFormHandler} >Add new user</button>

            <Pagination />
        </section>
    );
}

{/* <!-- Overlap components  --> */ }

{/*  <div className="table-overlap">
                                                <svg
                                                    aria-hidden="true"
                                                    focusable="false"
                                                    data-prefix="fas"
                                                    data-icon="triangle-exclamation"
                                                    className="svg-inline--fa fa-triangle-exclamation Table_icon__+HHgn"
                                                    role="img"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
                                                    ></path>
                                                </svg>
                                                <h2>There is no users yet.</h2>
                                            </div>  */}

{/* <!-- No content overlap component  --> */ }

{/*  <div className="table-overlap">
                                                <svg
                                                    aria-hidden="true"
                                                    focusable="false"
                                                    data-prefix="fas"
                                                    data-icon="triangle-exclamation"
                                                    className="svg-inline--fa fa-triangle-exclamation Table_icon__+HHgn"
                                                    role="img"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
                                                    ></path>
                                                </svg>
                                                <h2>Sorry, we couldn't find what you're looking for.</h2>
                                            </div>  */}

{/* <!-- On error overlap component  --> */ }

{/*  <div className="table-overlap">
                                                <svg
                                                    aria-hidden="true"
                                                    focusable="false"
                                                    data-prefix="fas"
                                                    data-icon="triangle-exclamation"
                                                    className="svg-inline--fa fa-triangle-exclamation Table_icon__+HHgn"
                                                    role="img"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 512 512"
                                                >
                                                    <path
                                                        fill="currentColor"
                                                        d="M506.3 417l-213.3-364c-16.33-28-57.54-28-73.98 0l-213.2 364C-10.59 444.9 9.849 480 42.74 480h426.6C502.1 480 522.6 445 506.3 417zM232 168c0-13.25 10.75-24 24-24S280 154.8 280 168v128c0 13.25-10.75 24-23.1 24S232 309.3 232 296V168zM256 416c-17.36 0-31.44-14.08-31.44-31.44c0-17.36 14.07-31.44 31.44-31.44s31.44 14.08 31.44 31.44C287.4 401.9 273.4 416 256 416z"
                                                    ></path>
                                                </svg>
                                                <h2>Failed to fetch</h2>
                                            </div>  */}
{/* <!-- </div> --> */ }