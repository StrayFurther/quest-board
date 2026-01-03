import "./LoginPage.css";
import {useState} from "react";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "../../firebase.ts";

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State variables for loading and error handling
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        setError(''); // Clear previous errors
        setLoading(true); // Indicate that the submission is in progress

        try {
            // Attempt to sign in the user with email and password
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('User logged in successfully:', user.uid);
            // Handle successful login, e.g., redirect to a dashboard or home page
            // You might use react-router-dom's useNavigate hook here:
            // navigate('/dashboard');

            // For now, let's just alert the user
            alert(`Welcome back, ${user.email}!`);

            // Optionally clear form fields after successful login
            setEmail('');
            setPassword('');

        } catch (err: any) {
            console.error("Error during login:", err.message);
            // Handle common Firebase authentication errors for login
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setError('Invalid email or password.');
            } else if (err.code === 'auth/invalid-email') {
                setError('The email address is not valid.');
            } else if (err.code === 'auth/user-disabled') {
                setError('This user account has been disabled.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div className="login-page">
            <h1>Login Page</h1>
            <form onSubmit={handleSubmit}> {/* Use the handleSubmit function */}

                {/* Display error messages */}
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}

                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email" // Changed to type="email"
                        id="email"
                        name="email"
                        value={email} // Controlled component
                        onChange={(e) => setEmail(e.target.value)} // Update state on change
                        required // Added required attribute
                        disabled={loading} // Disable inputs during loading
                    />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
}