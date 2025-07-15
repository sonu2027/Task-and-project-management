import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'
import Login from './pages/Login.jsx'
import Home from './pages/Home.jsx'
import ProjectsPage from './pages/ProjectPage.jsx'
import LandingPage from './pages/LandingPage.jsx'

function Routing() {
    return (
        <Routes>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/projects' element={<ProjectsPage />} />
            <Route path='/' element={<LandingPage />} />
        </Routes>
    )
}

export default Routing