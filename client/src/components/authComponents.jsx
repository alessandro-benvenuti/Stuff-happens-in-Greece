import { useActionState } from "react";
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { Link } from 'react-router';

function LoginForm(props) {
    const [state, formAction, isPending] = useActionState(loginFunction, {username: '', password: ''});

    async function loginFunction(prevState, formData) {
        const credentials = {
            username: formData.get('username'),
            password: formData.get('password'),
        };

        try {
            await props.handleLogin(credentials);
            return { success: true };
        } catch (error) {
            return { error: 'Login failed. Check your credentials.' };
        }
    }

    return (
        <>
            {/* while the server is processing the request, show a warning alert */}
            { isPending && <Alert variant="warning">Please, wait for the server's response...</Alert> }
            <Row>
                <Col md={6}>
                    {/* Login form, linked to formAction of useActionState */}
                    <Form action={formAction}>
                        {/* Form fields for username and password */}
                        <Form.Group controlId='username' className='mb-3'>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type='text' name='username' required />
                        </Form.Group>

                        <Form.Group controlId='password' className='mb-3'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type='password' name='password' required minLength={6} />
                        </Form.Group>

                        {/* Show error message if login fails */}
                        {state.error && <p className="text-danger">{state.error}</p>}

                        {/* Submit button, disabled if the request is pending */}
                        <Button type='submit' disabled={isPending}>Login</Button>

                        {/* Cancel button, disabled if the request is pending. Redirects to home */}
                        <Link className='btn btn-danger mx-2 my-2' to={'/'} disabled={isPending}>Cancel</Link>
                    </Form>
                </Col>
            </Row>
        </>
    );
}

function LogoutButton(props) {
  return <Button variant={props.darkMode ? 'outline-light' : 'outline-dark'} onClick={props.logout}>Logout</Button>;
}

export { LoginForm, LogoutButton };