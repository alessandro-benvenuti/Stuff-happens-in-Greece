import { useActionState } from "react";
import { Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";

function LoginForm(props) {
    const [state, formAction, isPending] = useActionState(loginFunction, {username: '', password: ''});
    const [darkMode, setDarkMode] = useState(document.documentElement.getAttribute("data-bs-theme") === "dark");

    
    useEffect(() => {
        const observer = new MutationObserver(() => {       // MutationObserver is a function that watches for changes in the DOM
            setDarkMode(document.documentElement.getAttribute("data-bs-theme") === "dark");     // when the data-bs-theme attribute changes, it updates the darkMode state
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-bs-theme"] });
        return () => observer.disconnect();                 // Cleanup the observer when the component unmounts
    }, []);

    async function loginFunction(prevState, formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            await props.handleLogin(credentials);
            return { success: true };
        } catch (error) {
            return { error: 'Username or password incorrect.' };
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <div
                className={`p-4 rounded shadow border ${darkMode ? "bg-dark text-light border-secondary" : "bg-white text-dark border"}`}
                style={{ minWidth: "350px", maxWidth: "400px" }}
            >
                <h2 className="mb-4 text-center">Login</h2>
                { isPending && <Alert variant={darkMode ? "secondary" : "warning"}>Please, wait for the server's response...</Alert> }
                <Form action={formAction}>
                    <Form.Group controlId='username' className='mb-3'>
                        <Form.Label>Username</Form.Label>
                        <Form.Control type='text' name='username' required autoFocus autoComplete="username" />
                    </Form.Group>

                    <Form.Group controlId='password' className='mb-3'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type='password' name='password' required minLength={6} autoComplete="current-password" />
                    </Form.Group>

                    {state.error && <p className="text-danger">{state.error}</p>}

                    <div className="d-flex justify-content-evenly align-items-center mt-3">
                        <Button type='submit' disabled={isPending} variant="primary">Login</Button>
                        <Link className={`btn btn-danger`} to={'/'} tabIndex={isPending ? -1 : 0} aria-disabled={isPending}>Cancel</Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}

function LogoutButton(props) {
  return <Button variant={props.darkMode ? 'outline-light' : 'outline-dark'} onClick={props.logout}>Logout</Button>;
}

export { LoginForm, LogoutButton };