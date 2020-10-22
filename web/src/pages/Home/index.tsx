import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { useHistory } from 'react-router-dom'

import gitLogo from '../../assets/github-logo.png'

import './styles.css'

function Home() {
    const [nickname, setNickname] = useState("")
    const history = useHistory()

    function handleSearch() {
        history.push(`/${nickname}`)
    }
    
    return (
        <div id="homepage">
            <div className="logo-content">
                <img className="logo" src={gitLogo} alt="Logo" />
                <h1 className="title">GitProfile</h1>
            </div>
            <div className="input-container">
                <BiSearch className="icon" size={20} />
                <input 
                    type="search" 
                    placeholder="Buscar perfil" 
                    value={nickname}
                    onChange={({ target }) => setNickname(target.value)}
                    autoComplete="false"
                    autoFocus={true}
                />
            </div>
            <button className="search" onClick={handleSearch}>Procurar</button>
        </div>
    )
}

export default Home