import UserListItem from './UserListItem.js';
 
const UserList = (props) => {
  const {sorted, setActive} = props;

  const showUsers = sorted.map((item) => {
    return <UserListItem key={item.id} setActive={setActive} item={item} />;
  });

  return <ul className='container-left-bottom-list'>{showUsers}</ul>;
};

export default UserList;
