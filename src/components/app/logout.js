import {GoogleLogout} from 'react-google-login';

const clientId = '325595501509-2f4588ufdpp3ak70ce5dvhtlks9rb90u.apps.googleusercontent.com'

const Logout = (props) => {
    const setLoggedUser = props.setLoggedUser;

    const onSuccess = () => {
        setLoggedUser(null);
    }

    return (
        <div id='signOutButton'>
            <GoogleLogout
                clientId={clientId}
                buttonText={'LogOut'}
                onLogoutSuccess={onSuccess}
            />
        </div>
    )
}

export default Logout;