import { useState } from 'react';


const Auth = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        setErrorMessage(''); 

        // Choose the right backend door
        const url = isLogin 
            ? 'http://localhost:5000/api/auth/login' 
            : 'http://localhost:5000/api/auth/register';

        const payload = isLogin 
            ? { email, password } 
            : { username, email, password };

        try {
            // Send the data across the CORS bridge
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong!');
            }

            if (isLogin) {
                // SUCCESS! Save the VIP wristband to the browser
                localStorage.setItem('token', data.token);
                onLoginSuccess(); // Tell the app we are logged in
            } else {
                alert('Registration successful! Please log in.');
                setIsLogin(true); // Switch to login view
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="auth-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            <h2>{isLogin ? 'Login to Weather Dashboard' : 'Create an Account'}</h2>
            
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: '0 auto', gap: '10px' }}>
                {!isLogin && (
                    <input 
                        type="text" 
                        placeholder="Username"
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                )}
                <input 
                    type="email" 
                    placeholder="Email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">
                    {isLogin ? 'Login' : 'Sign Up'}
                </button>
            </form>

            <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer' }}>
                {isLogin ? 'Need an account? Sign up here.' : 'Already have an account? Log in.'}
            </button>
        </div>
    );
};

export default Auth;