import "./NavigationBar.css";

export const NavigationBar = () => {
    return (
        <nav className="nav-medieval">
            <h1 className="nav-title">Navigation</h1>
            <div className="nav-flags">
                <a href="/" className="nav-flag">Home</a>
                <a href="/me" className="nav-flag">My Profile</a>
                <a href="/login" className="nav-flag">Login</a>
                <a href="/register" className="nav-flag">Register</a>
            </div>
        </nav>
    );
}