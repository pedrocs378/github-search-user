import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { Link, useParams } from 'react-router-dom'

import api from '../../services/api'

import './styles.css'

interface User {
    avatar_url: string
    name: string
    bio: string
    followers: number
    public_repos: number
}

interface UserParams {
    nickname: string
}

function Profile() {
    const params = useParams<UserParams>()
    const [user, setUser] = useState<User>()

    useEffect(() => {
        api.get(params.nickname).then(response => {
            setUser(response.data)
        })

    }, [params.nickname])

    return (
        <div id="profile-page">
            <div className="user">
                <Link to="/" className="go-back">
                    <FaArrowLeft size={30} color="white" />
                </Link>
                <img src={user?.avatar_url} alt={user?.name} />
                <div className="user-container">
                    <h3 className="user-name">{user?.name}</h3>
                    <p className="user-desc">{user?.bio}</p>
                    <p><strong>Seguidores:</strong> <span>{user?.followers}</span></p>
                    <p><strong>Repositórios:</strong> <span>{user?.public_repos}</span></p>
                </div>
            </div>
            <div className="repos">
                <h5>Top 4 repositórios: </h5>
                <ul>
                    <li>Repositório 1</li>
                    <li>Repositório 2</li>
                    <li>Repositório 3</li>
                    <li>Repositório 4</li>
                </ul>
            </div>
        </div>
    )
}

export default Profile