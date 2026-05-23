export default function NotFound() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1>404 — Page not found</h1>
            <a href="/login">Go back to login</a>
        </div>
    )
}