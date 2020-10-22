import React, { FormEvent, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { useHistory } from 'react-router-dom'

import gitLogo from '../../assets/github-logo.png'

import './styles.css'

function Home() {
    const [nickname, setNickname] = useState("")
    const history = useHistory()

    function handleSearch(event: FormEvent) {
        event.preventDefault()

        const form = document.querySelector('#homepage form')

        if (!nickname.trim()) {
            form?.classList.add('validate-error')

            const formError = document.querySelector('#homepage .validate-error')
            if (formError) {
                formError.addEventListener('animationend', (ev) => {
                        formError.classList.remove('validate-error')
                })
            }
            return
        }
        
        history.push(`/${nickname}`)
    }
    
    return (
        <div id="homepage">
            <div className="logo-content">
                <img className="logo" src={gitLogo} alt="Logo" />
                <h1 className="title">GitProfile</h1>
            </div>
            <form onSubmit={handleSearch}>
                <div className="input-container">
                    <BiSearch className="icon" size={20} />
                    <input 
                        type="search"
                        placeholder="Search profile..." 
                        value={nickname}
                        onChange={({ target }) => setNickname(target.value)}
                        autoFocus={true}
                    />
                </div>
                <button className="search" type="submit">
                    Search
                </button>
            </form>
        </div>
    )
}

export default Home