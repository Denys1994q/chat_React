import {GoogleLogin} from 'react-google-login';

const clientId = '325595501509-2f4588ufdpp3ak70ce5dvhtlks9rb90u.apps.googleusercontent.com'

const Login = (props) => {
    const setLoggedUser = props.setLoggedUser;

    const onSuccess = (res) => {
        console.log(res.profileObj)
        setLoggedUser(res.profileObj)
    }

    const onFailure = (res) => {
        alert('LOGIN FAILED', res);
    }

    return (
        <div id='signInButton'>
            <GoogleLogin
                clientId={clientId}
                buttonText='Login'
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
                isSignedIn={true}
            />
        </div>
    )
}

export default Login;