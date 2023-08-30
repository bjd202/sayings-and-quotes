'use client'

import {createContext, useContext, useState} from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }){
    const [loggedIn, setLoggedIn] = useState(false)

    const login = () => {
        setLoggedIn(true);
    }

    const logout = () => {
        setLoggedIn(false);
    }

    return(
        <AuthContext.Provider value={{ loggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth(){
    return useContext(AuthContext);
}