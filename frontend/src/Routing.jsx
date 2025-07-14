import { Routes, Route } from 'react-router-dom'
import Register from './pages/Register'

function Routing() {
    return (
        <Routes>
            <Route path='/register' element={<Register/>} />
        </Routes>
    )
}

export default Routing