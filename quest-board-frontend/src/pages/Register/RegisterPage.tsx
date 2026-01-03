import "./RegisterPage.css";
import { useState } from 'react';
import { auth, db } from '../../firebase'; // Adjust path if your firebase.js is elsewhere
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // State variables for loading and error handling
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success messages
        setLoading(true); // Indicate that the submission is in progress

        // Basic validation
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // 1. Create user with email and password using Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Save the username (and other desired info) to Cloud Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                createdAt: new Date(), // Optional: store creation timestamp
                uid: user.uid, // Optional: store UID in the document
            });

            console.log('User registered successfully and profile created:', user.uid);
            setSuccess('Registration successful! You can now log in.');
            // You might want to redirect the user here
            // e.g., navigate('/dashboard');
            // Reset form fields

            await setDoc(doc(db, "adventurers", user.uid), {
                xp: 0,
                name: username,
                level: 1,
            });

            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

        } catch (err: any) {
            console.error("Error during registration:", err.message);
            // Firebase error codes can be specific, you can tailor messages
            if (err.code === 'auth/email-already-in-use') {
                setError('The email address is already in use by another account.');
            } else if (err.code === 'auth/invalid-email') {
                setError('The email address is not valid.');
            } else if (err.code === 'auth/weak-password') {
                setError('The password is too weak. Please choose a stronger password.');
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false); // End loading state
        }
    };

    return(
        <div className="create-request__container">
            <form onSubmit={handleSubmit}> {/* Use the handleSubmit function */}
                <h2>Register</h2>

                {/* Display error messages */}
                {error && <p className="error-message" style={{ color: 'red' }}>{error}</p>}
                {success && <p className="success-message" style={{ color: 'green' }}>{success}</p>}

                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username} // Controlled component
                        onChange={(e) => setUsername(e.target.value)} // Update state on change
                        required
                        disabled={loading} // Disable inputs during loading
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email" // Use type="email" for better validation
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
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
                <div>
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input
                        type="password" // Should also be type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>
            </form>
        </div>
    );
};
