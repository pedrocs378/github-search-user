import React, { useEffect, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { FiLogIn } from 'react-icons/fi'
import { HiOutlineEmojiSad } from 'react-icons/hi'
import { BiGitRepoForked, BiStar } from 'react-icons/bi'
import { VscError } from 'react-icons/vsc'
import ReactLoading from 'react-loading'
import { Link, useParams } from 'react-router-dom'
import Pagination from '@material-ui/lab/Pagination'

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
    forks: number
}

interface UserParams {
    nickname: string
}

function Profile() {
    const [user, setUser] = useState<User>()
    const [repos, setRepos] = useState<RepositoryUser[]>([])
    const [reposPerPage, setReposPerPage] = useState<RepositoryUser[]>([])
    const [loaded, setLoaded] = useState(false)
    const [notFound, setNotFound] = useState(false)
    const [type, setType] = useState("all")
    const [count, setCount] = useState(0)
    const [page, setPage] = useState(1)

    const params = useParams<UserParams>()

    useEffect(() => {
        api
            .get(params.nickname)
            .then(response => {
                return response.data
            })
            .then((user) => {
                api
                    .get(`${params.nickname}/repos`)
                    .then(({ data }) => {
                        let cont = 0
                        let pages = 1

                        for (let i = 0; i < data.length; i++) {
                            if (cont >= 10) {
                                pages++
                                cont = 0
                            }
                            cont++
                        }
                    
                        setCount(pages)
                        setUser(user)
                        setReposPerPage(data.filter((repo: RepositoryUser, index: number) => {
                            if ((index >= 0) && (index <= 9)) {
                                return true
                            }
                        }))
                        setRepos(data)
                        setLoaded(true)
                    })
            })
            .catch(() => {
                setNotFound(true)
                setLoaded(true)
            })
        
    }, [params.nickname])

    useEffect(() => {
        handleReturnReposPerPage(page)
    }, [page])

    function handleReturnReposPerPage(page: number) {
        const aux = repos.filter((repo, index) => {
            if ((index >= (page - 1) * 10) && (index <= (page * 10) - 1)) {
                return true
            }
        }) as RepositoryUser[]

        setReposPerPage(aux)
    }

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
                    <div className="buttons-container">
                        <button 
                            className={type === "all" ? "selected" : ""}
                            onClick={() => setType("all")}
                        >
                            Show all
                        </button>
                        <button 
                            className={type === "top4" ? "selected" : ""}
                            onClick={() => setType("top4")}
                        >
                                Show Top 4
                            </button>
                    </div>
                </div>
            </div>
            <div className="repos">
                {
                    (!repos || repos.length === 0) ? (
                        <h3>
                            <span><HiOutlineEmojiSad size={25} /></span>
                            Not found repositories
                        </h3>
                    ) : type === "top4" ? (
                            <div>
                                <h3>
                                    <span><BiStar size={25} /></span>
                                    Top 4 star repositories
                                </h3>
                                <ul className="grid">
                                    {
                                        repos
                                            ?.sort((a, b) => b.stargazers_count - a.stargazers_count)
                                            .map((repo, index) => {
                                                if (index < 4) {
                                                    return (
                                                        <li className="grid-item" key={repo.id}>
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
                                <h3>
                                    <span><BiGitRepoForked size={25} /></span>
                                    Top 4 fork repositories
                                </h3>
                                <ul className="grid">
                                    {
                                        repos
                                            ?.sort((a, b) => b.forks - a.forks)
                                            .map((repo, index) => {
                                                if (index < 4) {
                                                    return (
                                                        <li className="grid-item" key={repo.id}>
                                                            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" >
                                                                <p><strong>#{index + 1}</strong> {repo.name}</p>
                                                                <p><strong>Forks: </strong>{repo.forks}</p>
                                                                <p>{repo.html_url}</p>
                                                            </a>
                                                        </li>
                                                    )
                                                }
                                            })
                                    }
                                </ul>
                            </div>
                    ) : (
                        <div>
                            <h3>
                                All repositories
                            </h3>
                            <ul className="grid">
                                {
                                    reposPerPage
                                        .map((repo) => {
                                            return (
                                                <li className="grid-item" key={repo.id}>
                                                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" >
                                                        <p>{repo.name}</p>
                                                        <p><strong>Stars: </strong>{repo.stargazers_count}</p>
                                                        <p><strong>Forks: </strong>{repo.forks}</p>
                                                        <p>{repo.html_url}</p>
                                                    </a>
                                                </li>
                                            )
                                            
                                        })
                                }
                            </ul>
                            <Pagination
                                style={{
                                    marginTop: 10,
                                    marginBottom: 20,
                                    marginLeft: 15
                                }}
                                count={count} 
                                onChange={(_, page) => setPage(page)}
                                variant="outlined" 
                                shape="rounded" 
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Profile