import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { FiLogIn } from 'react-icons/fi'
import { VscError } from 'react-icons/vsc'
import ReactLoading from 'react-loading'
import { Link, useParams } from 'react-router-dom'

import api from '../../services/api'

import './styles.css'

interface User {
    avatar_url: string
    name: string
    bio: string
    followers: number
    public_repos: number
    html_url: string
}

interface RepositoryUser {
    id: number
    name: string
    html_url: string
    stargazers_count: number
}

interface UserParams {
    nickname: string
}

function Profile() {
    const params = useParams<UserParams>()
    const [user, setUser] = useState<User>()
    const [repos, setRepos] = useState<RepositoryUser[]>([])
    const [loaded, setLoaded] = useState(false)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        api
            .get(params.nickname)
            .then(response => {
                setUser(response.data)
            })
            .then(() => {
                api
                    .get(`${params.nickname}/repos`)
                    .then(({ data }) => {
                        setRepos(data)
                        setLoaded(true)
                    })
            })
            .catch(() => {
                setNotFound(true)
                setLoaded(true)
            })
        
    }, [params.nickname])

    if (!loaded) {
        return (
            <div id="loading-user">
                <ReactLoading type="spinningBubbles" color="black" height={60} width={60} />
            </div>
        )
    }

    if (notFound) {
        return (
            <div id="not-found-user">
                <Link to="/" className="go-back" >
                    <FaArrowLeft size={30} color="black" />
                </Link>
                <div className="not-found-container">
                    <VscError size={50} />
                    <h1>Usuário não encontrado</h1>
                </div>
            </div>
        )
    }

    return (
        <div id="profile-page">
            <div className="user">
                <Link to="/" className="go-back">
                    <FaArrowLeft size={30} color="white" />
                </Link>
                <img src={user?.avatar_url} alt={user?.name} />
                <div className="content">
                    <div className="user-container">
                        <h3 className="user-name">{user?.name}</h3>
                        <p className="user-desc">{user?.bio}</p>
                        <p><strong>Followers:</strong> <span>{user?.followers}</span></p>
                        <p><strong>Repositories:</strong> <span>{user?.public_repos}</span></p>
                    </div>
                    <a className="access-user" href={user?.html_url} target="_blank" rel="noopener noreferrer">
                        <FiLogIn size={30} color="black" />
                        <span>Go to profile</span>
                    </a>
                </div>
            </div>
            <div className="repos">
                <h3>Top 4 repositories</h3>
                <ul>
                    {
                        repos
                            ?.sort((a, b) => b.stargazers_count - a.stargazers_count)
                            .map((repo, index) => {
                                if (index < 4) {
                                    return (
                                        <li key={repo.id}>
                                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" >
                                                <p><strong>#{index + 1}</strong> {repo.name}</p>
                                                <p><strong>Stars: </strong>{repo.stargazers_count}</p>
                                                <p>{repo.html_url}</p>
                                            </a>
                                        </li>
                                    )
                                }
                            })
                    }
                </ul>
            </div>
        </div>
    )
}

export default Profile