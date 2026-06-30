import { useEffect, useState } from 'react'
//import './App.css'
import './index.css'

function App() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selected, setSelected] = useState(new Set())
    const catalog = [
        { name: 'Coffee gift card', pts: 25 },
        { name: 'Branded shirt', pts: 50 },
        { name: 'Travel voucher', pts: 150},
    ]

    // Retrieve the collection of employees from the API
    function fetchEmployees() {
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

    // Award points to an employee by calling the API
    function awardPoints(id) {
        fetch(`/api/employees/${id}/award`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 10, reason: 'Great work' })
        })
            .then(res => {
                if (!res.ok) throw new Error(`Award failed: ${res.status}`)
                return res.json()
            })
            .then(updatedEmployee => {
                setEmployees(prev =>
                    prev.map(e => (e.id === updatedEmployee.id ? updatedEmployee : e))
                )
            })
            .catch(err => setError(err.message))
    }

    function redeemPoints(id, amount) {
        if (amount === 0) {
            return
        }
        fetch(`/api/employees/${id}/redeem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        })
            .then(res => {
                if (!res.ok) throw new Error(`Redeem failed: ${res.status}`)
                return res.json()
            })
            .then(updatedEmployee => {
                setEmployees(prev =>
                    prev.map(e => (e.id === updatedEmployee.id ? updatedEmployee : e))
                )

                setSelected(new Set()) // clear the selected items
            })
            .catch(err => setError(err.message))
    }

    function toggleCatalogItem(name) {
        setSelected(prev => {
            const next = new Set(prev)
            if (next.has(name)) {
                next.delete(name)
            } else {
                next.add(name)
            }

            return next
        })
    }

    useEffect(() => {
        fetchEmployees()
    }, [])

    if (loading) return <p>Loading employees...</p>
    if (error) return <p>Error: {error}</p>

    const sorted = [...employees].sort((a, b) => b.points - a.points)

    const totalSelected = catalog.filter(item => selected.has(item.name)).reduce((sum, item) => sum + item.pts, 0)

    return (
        <div className="content-row">

            <div>
                <h1>Employee Rewards Dashboard</h1>
                <div className="table-card">
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Points</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.map((emp, index) => (
                                <tr key={emp.id}>
                                    <td className="col-rank">{index + 1}</td>
                                    <td>
                                        <span className="avatar">
                                            {emp.name.slice(0, 2).toUpperCase()}
                                        </span>
                                        {emp.name}
                                    </td>
                                    <td>{emp.department}</td>
                                    <td className="col-points">{emp.points}</td>
                                    <td className="col-actions">
                                        <button
                                            className="btn-award"
                                            onClick={() => awardPoints(emp.id)}
                                        >
                                            +10
                                        </button>
                                        <button
                                            className="btn-redeem"
                                            onClick={() => redeemPoints(emp.id, totalSelected)}
                                            disabled={totalSelected === 0 || emp.points < totalSelected}
                                        >
                                            Redeem
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="catalog-list">
    {catalog.map(item => (
        <label key={item.name} className={`catalog-item ${selected.has(item.name) ? 'catalog-item-checked' : ''}`}>
            <input
                type="checkbox"
                checked={selected.has(item.name)}
                onChange={() => toggleCatalogItem(item.name)}
                className="catalog-checkbox"
            />
            <span className="catalog-name">{item.name}</span>
            <span className="catalog-pts">{item.pts} pts</span>
        </label>
    ))}
</div>

        </div>
    )
}

export default App
