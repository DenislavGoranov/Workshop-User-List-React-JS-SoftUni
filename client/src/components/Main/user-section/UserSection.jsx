import { useState, useEffect } from "react";
import CreateUser from "./create-user/CreateUser";
import Pagination from "./pagination/Pagination";
import Search from './search/Search'
import UserList from "./user-list/UserList";

export default function UserSection() {
    const [users, setUsers] = useState([]);
    const [showUserForm, setShowUserForm] = useState(false);

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

    const createUserFormCloseHandler = () => {
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
        const data = await response.json();

        return data;
    }

    return (
        <section className="card users-container">
            <Search />

            <UserList users={users} />

            {showUserForm && <CreateUser onCreateUser={submitCreateUserHandler} />}

            <button className="btn-add btn" onClick={openCreateUserFormHandler}>Add new user</button>

            <Pagination />
        </section>
    );
}