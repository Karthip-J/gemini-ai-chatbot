// import React from "react";

// const Sidebar = ({ chats, selectChat, currentChat }) => {
//   const logout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   return (
//     <div className="sidebar">
//       <h2>Gemini Chat</h2>
//       <button onClick={logout} className="logout-btn">Logout</button>
//       <ul>
//         {chats.map((chat) => (
//           <li
//             key={chat._id}
//             className={currentChat?._id === chat._id ? "active" : ""}
//             onClick={() => selectChat(chat)}
//           >
//             {chat.title || "Untitled Chat"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidebar;

import React from "react";

const Sidebar = ({ chats, selectChat, currentChat, createNewChat }) => {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <h2>Gemini Chat</h2>

      <button onClick={createNewChat} className="new-chat-btn">
        + New Chat
      </button>

      <ul>
        {chats.map((chat) => (
          <li
            key={chat._id}
            className={currentChat?._id === chat._id ? "active" : ""}
            onClick={() => selectChat(chat)}
          >
            {chat.title || "Untitled Chat"}
          </li>
        ))}
      </ul>

      <button onClick={logout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
