// стилі
import "../../style/style.sass";
// картинки
import logo_person from "../../imgs/logo_person.png";
import user1 from "../../imgs/us.png";
import user2 from "../../imgs/user2.png";
import user3 from "../../imgs/user3.png";
import user4 from "../../imgs/user4.png";
import logo_message from "../../imgs/logo_send.svg";
// хуки
import React, { useEffect, useState } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { gapi } from "gapi-script";
// компоненти
import UserList from "./UserList";
import LoginButton from "./login";
import LogoutButton from "./logout";

const clientId =
  "325595501509-2f4588ufdpp3ak70ce5dvhtlks9rb90u.apps.googleusercontent.com";

const App = () => {
  // key

  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: clientId,
        scope: "",
      });
    }

    gapi.load("client:auth2", start);
  });

  // інпут для пошуку контактів
  const [searchValue, setSearchValue] = useState("");
  // активний юзер (по якому клікнули)
  const [active, setActive] = useState("Alice Freeman");
  const [messageSent, setMessageSent] = useState(false);
  // текст повідомлення з textarea
  const [textAreaValue, setTextAreaValue] = useState("");
  // динамічна висота блоку, де вводиться текст повідомлення в textarea
  const [height, setHeight] = useState("4.6rem");
  // скрол на останнє повідомлення
  const ref = React.createRef();
  // дані юзерів з контактів (відразу з локал сторедж, щоб показувалася історія)
  const [users, setUsers] = useLocalStorage("users", [
    {
      name: "Alice Freeman",
      img: user3,
      id: 1,
      messages: [
        {
          text: "Quickle come to the meeting room 18, we have a big server issue",
          time: 1660936340820,
          timeToShow: "9/18/2022 9:25 pm",
          author: "Alice",
        },
        {
          text: "I am having breakfast right now, can`t you wait for 10 minutes?",
          time: 1660936340842,
          timeToShow: "9/18/2022 9:27 pm",
          author: "me",
        },
      ],
    },
    {
      name: "Josefina",
      img: user2,
      id: 2,
      messages: [
        {
          text: "We are losing money!",
          time: 1660936340821,
          timeToShow: "09/18/2022 11:25 pm",
          author: "Josefina",
        },
        {
          text: "Ok",
          time: 1660936340834,
          timeToShow: "9/18/2022 12:25 am",
          author: "me",
        },
      ],
    },
    {
      name: "Velazquez",
      img: user1,
      id: 3,
      messages: [
        {
          text: "Quickly come to the meeting room",
          time: 1660936340833,
          timeToShow: "9/18/2022 3:18 am",
          author: "Velazquez",
        },
      ],
    },
    {
      name: "Barerra",
      img: user4,
      id: 4,
      messages: [
        {
          text: "Hi",
          time: 1660936340815,
          timeToShow: "9/18/2022 3:13 am",
          author: "Barerra",
        },
      ],
    },
  ]);
  // відфільтровані юзери
  const filteredUsers = users.filter((item) => {
    return item.name.toLowerCase().includes(searchValue.toLowerCase());
  });
  // коли повідомлення відправлено, запуск ф-ії по зверненню до API для отримання повідомлення-відповіді
  useEffect(() => {
    if (messageSent) {
      const timer = setTimeout(() => {
        getAnswerFromAPI();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [messageSent]);

  // відфільтровані юзери, які сортуються по новим повідомленням
  const sorted = filteredUsers.sort((a, b) =>
    a.messages[a.messages.length - 1].time <
    b.messages[b.messages.length - 1].time
      ? 1
      : -1
  );

  // ф-ія для динамічної зміни висоти блоку textarea
  const changeHeight = (e) => {
    setHeight(e.target.scrollHeight);

    if (e.key === "Backspace" && e.target.value.length > 5) {
      setHeight((old) => old - 10);
    } else if (e.target.value.length === 0) {
      setHeight("4.6rem");
    } else if (e.key === "Enter") {
      addMessage();
    }
  };
  // вивід у верстку повідомлень юзерів
  const showMessages = users
    .filter((it) => {
      return it.name === active;
    })
    .map((item) => {
      return item.messages.map((mess) => {
        return (
          <>
            {mess.author !== "me" ? (
              <div className='container-right-main-list-left'>
                <li>
                  <div className='container-right-main-list-img'>
                    <img src={item.img} alt='' />
                  </div>
                  <div>
                    <div className='container-right-main-list-text'>
                      {mess.text}
                    </div>
                  </div>
                </li>
                <div className='container-right-main-list-time'>
                  {mess.timeToShow}
                </div>
              </div>
            ) : (
              <div className='container-right-main-list-right'>
                <li>
                  <div>
                    <div className='container-right-main-list-text-me'>
                      {mess.text}
                    </div>
                    <div className='container-right-main-list-time-me'>
                      {mess.timeToShow}
                    </div>
                  </div>
                </li>
              </div>
            )}
          </>
        );
      });
    });
  // додаємо повідомлення в дані контактів, яке ввів юзер
  const addMessage = () => {
    if (textAreaValue !== "") {
      setMessageSent(true);

      // час
      const date = new Date();
      let hours = date.getHours();
      let minutes = date.getMinutes();
      let ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      let strTime = hours + ":" + minutes + " " + ampm;
      // дата
      const dateTime = `${
        date.getMonth() + 1
      }/${date.getDate()}/${date.getFullYear()} `;
      // час і дата
      const showDateAndTime = dateTime + strTime;

      const index = users.findIndex((it) => it.name === active);
      const old = users.filter((it) => {
        return it.name === active;
      })[0]; // копія активного юзера
      const oldMessages = old.messages; // копія повідомлень активного юзера
      const newMessages = [
        ...oldMessages,
        {
          text: textAreaValue,
          time: date,
          timeToShow: showDateAndTime,
          author: "me",
        },
      ]; // старі повідомлення юзера + нові
      const newItem = { ...old, messages: newMessages }; // оновлений юзер з новими повідомленнями
      const newArray = [
        ...users.slice(0, index),
        newItem,
        ...users.slice(index + 1),
      ]; // оновлений масив з новим юзером
      setUsers(newArray);

      setTextAreaValue("");
    }
  };

  // звернення до АПІ
  const getAnswerFromAPI = () => {
    fetch("https://api.chucknorris.io/jokes/random")
      .then((res) => res.json())
      .then((data) => createMessageFromAPI(data.value))
      .catch((error) => console.error("Помилка:", error));
  };

  // створення повідомлення-відповіді
  const createMessageFromAPI = (res) => {
    // час
    const date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let strTime = hours + ":" + minutes + " " + ampm;
    // дата
    const dateTime = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} `;
    // час і дата
    const showDateAndTime = dateTime + strTime;

    setMessageSent(false);

    const index = users.findIndex((it) => it.name === active);
    const old = users.filter((it) => {
      return it.name === active;
    })[0]; // копія активного юзера
    const oldMessages = old.messages; // копія повідомлень активного юзера
    const newMessages = [
      ...oldMessages,
      { text: res, time: date, timeToShow: showDateAndTime, author: active },
    ]; // старі повідомлення юзера + нові
    const newItem = { ...old, messages: newMessages }; // оновлений юзер з новими повідомленнями
    const newArray = [
      ...users.slice(0, index),
      newItem,
      ...users.slice(index + 1),
    ]; // оновлений масив з новим юзером
    setUsers(newArray);
  };
  // скрол на останнє повідомлення
  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [users]);

  const activeUserPhoto = users
    .filter((it) => {
      return it.name === active;
    })
    .map((item) => {
      return item.img;
    });

  return (
    <div className='container'>
      <div className='container-left'>
        <div className='container-left-login-wrapper'>
          <div className='container-left-logo'>
            <img src={logo_person} alt='' />
          </div>
          <div className='container-left-login-wrapper-btns'>
            <LoginButton />
            <LogoutButton />
          </div>
        </div>
        <div className='container-left-wrapper'>
          <div className='container-left-inpWrapper'>
            <input
              className='container-left-inp'
              type='text'
              placeholder='Search or start new chart'
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>
        <div className='container-left-bottom'>
          <div className='container-left-bottom-title'>Chats</div>
          <div>
            <UserList sorted={sorted} setActive={setActive} />
          </div>
        </div>
      </div>

      <div className='container-right'>
        <div className='container-right-top'>
          <div className='container-right-userImg'>
            <img src={activeUserPhoto} alt='' />
          </div>
          <div className='container-right-userName'>{active}</div>
        </div>

        <div className='container-right-main'>
          <div>
            <ul ref={ref} className='container-right-main-list'>
              {showMessages}
              <div></div>
            </ul>
          </div>
        </div>

        <div className='container-right-bottom'>
          <div>
            <div className='container-right-bottom-typeText'>
              <div className='container-right-bottom-areaWrapper'>
                <textarea
                  value={textAreaValue}
                  onChange={(e) => setTextAreaValue(e.target.value)}
                  style={{ height: height }}
                  onKeyUp={(e) => changeHeight(e)}
                  placeholder='Type your message'
                />
              </div>
              <div onClick={addMessage} className='container-right-bottom-img'>
                <img src={logo_message} alt='logo_icon_message' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
