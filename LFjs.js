/* Results Dashboard Styling */
.result-screen {
    text-align: center;
}

.result-header h2 {
    color: var(--primary-purple);
    margin-bottom: 10px;
}

.dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 25px 0;
}

.plan-card {
    background: linear-gradient(135deg, var(--light-lavender) 0%, #f5f0ff 100%);
    border: 2px solid var(--primary-purple);
    border-radius: 15px;
    padding: 20px;
    text-align: center;
}

.card-icon {
    font-size: 2.5rem;
    margin-bottom: 10px;
}

.plan-card h3 {
    color: var(--primary-purple);
    margin: 10px 0 15px;
}

.output-text {
    font-size: 0.9rem;
    color: var(--text-dark);
    line-height: 1.5;
    text-align: left;
    min-height: 80px;
}
