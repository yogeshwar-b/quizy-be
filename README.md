# quizy-be

Quizy Back End provides the server-side functionality for hosting interactive quiz games. A host can create a game room secured with a unique name and password. Players join the room using these credentials and wait for the host to start the game. At the end of each game, a ranked scoreboard is displayed to showcase player standings.

## Technologies used -

- **Web API:** [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **WebSocket Implementation:** [Socket.io](https://socket.io/)
- **Runtime:** [Bun](https://bun.sh/) (compatible with Node.js)

![Express.js logo](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=flat-square)
![MongoDB logo](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white&style=flat-square)
![Mongoose logo](https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=white&style=flat-square)
![Socket.io logo](https://img.shields.io/badge/Socket.io-010101?logo=socket.io&logoColor=white&style=flat-square)
![Bun logo](https://img.shields.io/badge/Bun-000000?logo=bun&logoColor=white&style=flat-square)

## Features

- **Host Control:**  
   The host has complete control over when to start the game.

- **Question Management:**  
   The host can add or edit questions before the game starts.

- **Flexible Question Delivery:**  
   The host can send questions to players at their discretion.

- **Real-Time Synchronization:**  
   All players receive questions simultaneously, ensuring everyone stays in sync.

- **Scoreboard Generation:**  
   At the end of the game, the host can generate a scoreboard to announce the winner.

---

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.js
```

---

## 💡 Proof of Concept - Front End Implmentation of this API can be seen at [Quizy-FE](https://github.com/yogeshwar-b/quizy-fe)

## API Documentation

### Root

- **GET `/`**  
  Returns a "Welcome to Quizy!" message.

---

### Host Routes (`/quizhost`)

- **GET `/viewquestions`**  
  Returns all questions in the database.

- **GET `/viewquestion/:qid`**  
  Returns a single question by its `questionid`.

- **GET `/viewquestionbyroom/:roomname`**  
  Returns all questions for a specific room.

- **DELETE `/deletequestion/:qid/:roomname`**  
  Deletes a question by its `questionid` and `roomname`.

- **GET `/submitchoices/:roomname`**  
  Emits a `submitchoices` event to all clients in the room.

- **GET `/calculatescore/:roomname`**  
  Calculates and updates scores for all players in the room.

- **GET `/sendquestion/:roomname/:questionnumber`**  
  Sends a specific question to all players in the room.

- **POST `/savequestion`**  
  Adds a new question.  
  **Body:**

  ```json
  {
    "questiontxt": "string", //How many planets does Solar System have?
    "choices": number[], //[10,5,2,9]
    "answer": number, //3
    "roomname": "string" //mysampleroom
  }
  ```

- **PUT `/editquestion`**  
  Edits an existing question.  
  **Body:**
  ```json
  {
    "questionid": "string",
    "questiontxt": "string",
    "choices": number[],
    "answer": number,
    "roomname": "string"
  }
  ```

---

### Player Routes (`/player`)

- Handles player submissions and related actions.

---

### Utility Routes (`/utility`)

- **GET `/scoreboard/:roomname`**  
  Returns the scoreboard (sorted by score) for a specific room.

---

### WebSocket Events

- **createroom**  
  Creates a new room.

- **joinroom**  
  Joins an existing room.

- **manageroom**  
  Authenticates and manages a room.

---

</br>

<sup>Incase you missed it - Proof of Concept - Front End Implmentation of this API can be seen at [Quizy-FE](https://github.com/yogeshwar-b/quizy-fe)</sup>
