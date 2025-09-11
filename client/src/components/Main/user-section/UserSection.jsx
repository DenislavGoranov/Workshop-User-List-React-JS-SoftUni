import { useState, useEffect } from "react";
import CreateUser from "./create-user/CreateUser";
import Pagination from "./pagination/Pagination";
import Search from './search/Search'
import UserList from "./user-list/UserList";
import DetailsUser from "./details-user/DetailsUser";
import DeleteUser from "./delete-user/DeleteUser";

export default function UserSection() {
    const [users, setUsers] = useState([]);

    const [showCreateForm, setShowUserForm] = useState(false);

    const [showDetailsForm, setShowDetailsForm] = useState(false);
    const [userDataDetails, setUserDataDetails] = useState({});

    const [showDeleteForm, setShowDeleteForm] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:3030/jsonstore/users`);
                const data = await response.json();
                const dataArray = Object.values(data);
                setUsers(dataArray)
            } catch (err) {
                alert(err.message);
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
        // try {

        //     await fetch(`http://localhost:3030/jsonstore/users/${userId}`, {
        //         method: "Delete"
        //     });

        //     setUsers(oldUsers => oldUsers.filter(oldUsers._id !== userId));

        // } catch (err) {
        //     console.log(err.message)
        // } finally {
        //     setShowDeleteForm(false);
        // }

    }

    const closeDeleteFormHandler = () => {
        setShowDeleteForm(false);
    }




    return (
        <section className="card users-container">
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
                <DeleteUser closeDeleteForm={closeDeleteFormHandler} />
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