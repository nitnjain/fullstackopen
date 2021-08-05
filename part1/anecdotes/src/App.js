import React, { useState } from 'react';

const Button = ({ onClick, text }) => <><button onClick={onClick}>{text}</button></>

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blod tests when dianosing patients'
  ];
   
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0));

  const genAnecdote = () => {
    const selection = Math.floor(Math.random() * 7);
    setSelected(selection);
  }

  const vote = (index) => {
    let newVotes = [...votes];
    newVotes[index] += 1;
    setVotes(newVotes);
  }

  return (
    <>
      <h1>Random Anecdote</h1>
      {anecdotes[selected]}<br></br>
      <Button onClick={() => vote(selected)} text="vote" />
      <Button onClick={() => genAnecdote()} text="random anecdote"/>
      <h1>Most Voted Anecdote</h1>
      {anecdotes[votes.indexOf(Math.max(...votes))]}
    </>
  );
}

export default App;