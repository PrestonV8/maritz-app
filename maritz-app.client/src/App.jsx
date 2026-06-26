import { useEffect, useState } from 'react'
import './App.css'

function App() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        fetchEmployees()
    }, [])

    function fetchEmployees() {
        setLoading(true)
        fetch('/api/employees')
            .then(res => {
                if (!res.ok) throw new Error(`Server responded ${res.status}`)
                return res.json()
            })
            .then(data => {
                setEmployees(data)
                setError(null)
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false))
    }

    function awardPoints(id)
    {
        fetch(`/api/employees/${id}/award`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: 10, reason: 'Great work'})
            })
            .then(response => {
                if (!response.ok) throw new Error(`Award failed: ${response.status}`)
                return response.json()
            })
            .then(data => {
                setEmployees(previous => previous.map(e => (e.id === updatedEmployee.id ? updatedEmployee : e))
                )
            })
            .catch(error => setError(error.message))
    }

    if (loading) return <p>Loading employees...</p>
    if (error) return <p>Error: {error}</p>


    return (
        <div>
            <h1>Employee Rewards Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Department</th>
                        <th>Points</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(emp => (
                        <tr key={emp.id}>
                            <td>{emp.name}</td>
                            <td>{emp.department}</td>
                            <td>{emp.points}</td>
                            <td>
                                <button onClick={() => awardPoints(emp.id)}>
                                    +10 points
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
  )
}

export default App
