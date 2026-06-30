import { useEffect, useState } from 'react'
//import './App.css'
import './index.css'

function App() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

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

    function redeemPoints(id) {
        fetch(`/api/employees/${id}/redeem`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 10 })
        })
            .then(res => {
                if (!res.ok) throw new Error(`Redeem failed: ${res.status}`)
                return res.json()
            })
            .then(updatedEmployee => {
                setEmployees(prev =>
                    prev.map(e => (e.id === updatedEmployee.id ? updatedEmployee : e))
                )
            })
            .catch(err => setError(err.message))
    }

    useEffect(() => {
        fetchEmployees()
    }, [])

    // Derived stats for the summary cards — purely presentational, no new requests
    const totalEmployees = employees.length
    const pointsAwarded = employees.reduce((sum, e) => sum + (e.points || 0), 0)
    const topTier = employees.length > 0
        ? employees.reduce((max, e) => (e.points > max.points ? e : max), employees[0])
        : null

    function initials(name) {
        if (!name) return '??'
        return name.slice(0, 2).toUpperCase()
    }

    function tierFor(points) {
        if (points >= 200) return 'Gold'
        if (points >= 100) return 'Silver'
        return 'Bronze'
    }

    if (loading) {
        return (
            <div className="app-shell">
                <p className="status-text">Loading employees...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="app-shell">
                <p className="status-text status-error">Error: {error}</p>
            </div>
        )
    }


    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="brand">
                    <span className="brand-mark" />
                    <span className="brand-name">DriveRewards</span>
                </div>
                <nav className="topnav">
                    <a className="topnav-link active" href="#">Dashboard</a>
                    <a className="topnav-link" href="#">Catalog</a>
                    <a className="topnav-link" href="#">Activity</a>
                </nav>
                <div className="avatar">PM</div>
            </header>

            <main className="page">
                <div className="page-header">
                    <div>
                        <h1>Employee rewards dashboard</h1>
                        <p className="subtitle">Q2 incentive program overview</p>
                    </div>
                    <button className="btn btn-outline">
                        <span className="btn-icon" />
                        Enroll employee
                    </button>
                </div>

                <section className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Total employees</span>
                        <span className="stat-value">{totalEmployees}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Points awarded</span>
                        <span className="stat-value">{pointsAwarded}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Points redeemed</span>
                        <span className="stat-value">120</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Top tier</span>
                        <span className="stat-value">{topTier ? tierFor(topTier.points) : '—'}</span>
                    </div>
                </section>

                <div className="content-grid">
                    <section className="leaderboard">
                        <h2>Leaderboard</h2>
                        <div className="table-wrap">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Rank</th>
                                        <th>Name</th>
                                        <th>Department</th>
                                        <th>Tier</th>
                                        <th>Points</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees
                                        .slice()
                                        .sort((a, b) => b.points - a.points)
                                        .map((emp, index) => (
                                            <tr key={emp.id}>
                                                <td className="muted">{index + 1}</td>
                                                <td>
                                                    <div className="name-cell">
                                                        <span className="avatar-sm">{initials(emp.name)}</span>
                                                        <span>{emp.name}</span>
                                                    </div>
                                                </td>
                                                <td className="muted">{emp.department}</td>
                                                <td>
                                                    <span className={`tier-badge tier-${tierFor(emp.points).toLowerCase()}`}>
                                                        {tierFor(emp.points)}
                                                    </span>
                                                </td>
                                                <td className="points-cell">{emp.points}</td>
                                                <td>
                                                    <div className="action-stack">
                                                        <button
                                                            className="btn btn-pill"
                                                            onClick={() => awardPoints(emp.id)}
                                                        >
                                                            +10
                                                        </button>
                                                        <button
                                                            className="btn btn-pill"
                                                            onClick={() => redeemPoints(emp.id)}
                                                            disabled={emp.points < 10}
                                                        >
                                                            Redeem
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <aside className="sidebar">
                        <h2>Rewards catalog</h2>
                        <div className="catalog-list">
                            <div className="catalog-item">
                                <span className="catalog-icon" />
                                <span className="catalog-name">Coffee gift card</span>
                                <span className="catalog-cost">25 pts</span>
                            </div>
                            <div className="catalog-item">
                                <span className="catalog-icon" />
                                <span className="catalog-name">Branded apparel</span>
                                <span className="catalog-cost">60 pts</span>
                            </div>
                            <div className="catalog-item">
                                <span className="catalog-icon" />
                                <span className="catalog-name">Travel voucher</span>
                                <span className="catalog-cost">150 pts</span>
                            </div>
                        </div>

                    </aside>
                </div>
            </main>
        </div>
    )
}

export default App
