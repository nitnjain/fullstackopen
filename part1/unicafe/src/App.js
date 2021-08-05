import React, { useState } from 'react';

const Button = ({ onClick, text }) => <><button onClick={onClick}>{text}</button></>

const StatisticLine = ({text, value}) => <><tr><td>{text}</td><td>{value}</td></tr></>

const Statistics = ({ good, neutral, bad, all, avg, pos }) => {
    if(all === 0) {
        return <><p>No previous feedbacks</p></>
    }
    return (
        <>
            <table>
                <tbody>
                    <StatisticLine text="Good" value={good} />
                    <StatisticLine text="Neutral" value={neutral} />
                    <StatisticLine text="Bad" value={bad} />
                    <StatisticLine text="All" value={all} />
                    <StatisticLine text="Average" value={avg} />
                    <StatisticLine text="Positive" value={pos + " %"} />
                </tbody>
            </table>
        </>
    );
}

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);
    const [all, setAll] = useState(0);
    const [avg, setAvg] = useState(0);
    const [pos, setPos] = useState(0);

    const add = type => () => {
        let newGood = good;
        let newNeutral = neutral;
        let newBad = bad;
        let newAll = all;
        let newAvg = avg;
        let newPos = pos;

        if(type === 'good') {
            newGood += 1;
        } else if(type === 'bad') {
            newBad += 1;
        } else {
            newNeutral += 1;
        }

        newAll += 1;
        newAvg = (newGood - newBad) / newAll;
        newPos = (newGood / newAll) * 100;

        setGood(newGood);
        setNeutral(newNeutral);
        setBad(newBad);
        setAll(newAll);
        setAvg(newAvg);
        setPos(newPos);
    }

    return (
        <>
            <h1>Submit feedback</h1>
            <Button onClick={add('good')} text="Good" />
            <Button onClick={add('neutral')} text="Neutral" />
            <Button onClick={add('bad')} text="Bad" />
            <h1>Previous Feedbacks</h1>
            <Statistics good={good} neutral={neutral} bad={bad} all={all} avg={avg} pos={pos} />
        </>
    );
}

export default App