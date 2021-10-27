import React, {useState, useEffect} from 'react'
import axios from 'axios'

const Country = ({ country }) => {
    const [weather, setWeather] = useState({ temperature: '', })

    useEffect(() => {
        axios
        .get(`http://api.weatherstack.com/current?access_key=${process.env.REACT_APP_API_KEY}&query=${country.capital[0]}`)
        .then(response => {
            setWeather(response.data.current)
        })
    }, [])

    return (
        <div>
            <h2>{country.flag} {country.name.common}</h2>
            <p>Capital: {country.capital[0]}<br />
            Population: {country.population}</p>
            <h3>Languages</h3>
            <ul>
                {Object.keys(country.languages).map(key => <li key={key}>{country.languages[key]}</li>)}
            </ul>
            <img src={country.flags.png} width="250px" alt={country.name.country}/>
            <h3>Weather in {country.capital[0]}</h3>
            <p>Temperature: {weather.temperature}<br />
            <img src={weather.weather_icons} alt={country.name.country} /><br />
            Wind: {weather.wind_speed} ({weather.wind_degree} {weather.wind_dir})</p>
        </div>
    )
}

const Results = ({ results, showCountry }) => {
    if(results.length > 10) {
        return (
            <div>
                Too many results, please add more info to search
            </div>
        )
    }

    if(results.length === 1) {
        const [ country ] = results
        return (
            <div>
                <Country country={country} />
            </div>
        )
    }

    if(results.length === 0) {
        return (
            <div>
                No country found, please change your search
            </div>
        )
    }

    return (
        <div><br />
            {results.map(country => (
                <div key={country.cca2}>
                    {country.flag} {country.name.common} <button onClick={() => showCountry(country.name.common)}>show</button>
                </div>
            ))}
        </div>
    )
}

const App = () => {
    const [all, setAll] = useState([])
    const [results, setResults] = useState([])
    const [q, setQ] = useState('')

    useEffect(() => {
        axios
        .get('https://restcountries.com/v3.1/all')
        .then(response => {
            setAll(response.data)
        })
    }, [])

    useEffect(() => {
        setResults(all.filter(country => country.name.common.match(new RegExp(q, "i"))))
    }, [q])

    const handleQChange = (e) => {
        setQ(e.target.value)
    }

    const showCountry = (country) => {
        return setResults([all.find(c => c.name.common === country)])
    }

    return (
        <div>
            Search: <input value={q} onChange={handleQChange} />
            <Results results={results} showCountry={showCountry} />
        </div>
    )
}

export default App