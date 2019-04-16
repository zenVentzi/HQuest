import React, { useState } from "react";
import { MentionsInput, Mention, SuggestionDataItem } from "react-mentions";
import Modal from "Reusable/Modal";

// function fetchUsers(query, callback) {
//   if (!query) return;
//   fetch(`https://api.github.com/search/users?q=${query}`, { json: true })
//     .then(res => res.json())

//     // Transform the users to what react-mentions expects
//     .then(res =>
//       res.items.map(user => ({ display: user.login, id: user.login }))
//     )
//     .then(callback);
// }

const users: SuggestionDataItem[] = [
  {
    id: "1",
    display: "Jimmy"
  },
  {
    id: "2",
    display: "Ketut"
  },
  {
    id: "3",
    display: "Gede"
  }
];

function App() {
  return <Modal>hahaha im inside a modal</Modal>;
}

export default App;
