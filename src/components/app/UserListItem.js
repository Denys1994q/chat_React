const UserListItem = (props) => {

    const setActive = props.setActive;
    const item = props.item;

    
    const timeFormat = item.messages[item.messages.length-1].timeToShow.slice(0,10)
    const textFormat = item.messages[item.messages.length-1].text.length > 65 ? item.messages[item.messages.length-1].text.slice(0,65) + '...' : item.messages[item.messages.length-1].text

  return (
    <li key={item.id} onClick={() => setActive(item.name)}>
      <div className='container-left-bottom-list-img'>
        <img src={item.img} alt='' />
      </div>
      <div className='container-left-bottom-list-info'>
        <div className='bold'>{item.name}</div>
        <div>{textFormat}</div>
      </div>
      <div className='container-left-bottom-list-time'>{timeFormat}</div>
    </li>
  );
};

export default UserListItem;
