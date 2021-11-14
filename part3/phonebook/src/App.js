import React, {useEffect, useState} from "react"
import personService from './services/person'

const Notification = ({ msg }) => {
    if(msg === null) {
        return null
    }

    const msgStyle = {
        color: "#eee",
        backgroundColor: msg.type === "s" ? "green" : "red",
        fontSize: 25,
        padding: 5
    }

    return (
        <div style={msgStyle}>
            {msg.msg}
        </div>
    )
}

const Filter = ({ search, handleSearchChange }) => {
    return (
        <div>
            Search: <input value={search} onChange={handleSearchChange} />
        </div>
    )
}

const PersonForm = (props) => {
    return (
        <div>
            <form onSubmit={props.addName}>
                <div>
                    name: <input value={props.newName} onChange={props.handleNameChange} /><br />
                    number: <input value={props.newNumber} onChange={props.handleNumberChange} />
                </div>
                <div>
                    <button type="submit">add</button>
                </div>
            </form>
        </div>
    )
}

const Persons = ({ persons, removePerson }) => { 
    return (
        <div>
            <ul>
                {persons.map(person => <li key={person.id}>{person.name} - {person.number} <button onClick={() => removePerson(person.id)}>delete</button></li>)}
            </ul>
        </div>
    )
}

const App = () => {
    const [persons, setPersons] = useState([])

    const [ newName, setNewName ] = useState('')
    const [ newNumber, setNewNumber ] = useState('')
    const [ search, setSearch ] = useState('')

    const [ msg, setMsg ] = useState(null)

    useEffect(() => {
        personService
        .getAll()
        .then(response => {
            setPersons(response)
        })
    }, [])

    const handleNameChange = (e) => {
        setNewName(e.target.value)
    }
    
    const handleNumberChange = (e) => {
        setNewNumber(e.target.value)
    }

    const handleSearchChange = (e) => {
        setSearch(e.target.value)
    }

    const addName = (e) => {
        e.preventDefault()

        if(persons.some(p => p.name.toLowerCase() === newName.toLowerCase())) {
            const updateConfirm = window.confirm(`${newName} already exists in the phonebook, do you want to update their number?`)

            if(updateConfirm) {
                const existingObj = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

                const updatedObj = { ...existingObj, number: newNumber }

                personService.update(updatedObj, existingObj.id)
                .then(response => {
                    setPersons(persons.map(p => p.id === existingObj.id ? response : p))

                    setMsg({ msg: `${updatedObj.name}'s number has been updated in the phonebook`, type: 's' })
                    setInterval(() => {
                        setMsg(null)
                    }, 5000)
                })
                .catch(e => {
                    setMsg({ msg: e.response.data.error, type: 'e' })
                    setInterval(() => {
                        setMsg(null)
                    }, 5000)
                })
            }

            setNewNumber('')
            setNewName('')

            return null;
        }

        const newObject = {
            name: newName,
            number: newNumber
        }

        personService.add(newObject)
        .then(response => {
            setPersons(persons.concat(response))
            setMsg({ msg: `${response.name} has been added to the phonebook`, type: 's' })
            setInterval(() => {
                setMsg(null)
            }, 5000)
        })
        .catch(e => {
            setMsg({ msg: e.response.data.error, type: 'e' })
            setInterval(() => {
                setMsg(null)
            }, 5000)
        })

        setNewNumber('')
        setNewName('')
    }

    const removePerson = (id) => {
        const personToRemove = persons.find(p => p.id === id)
        const confirm = window.confirm(`Do yo want to delete ${personToRemove.name}`);
        
        if(confirm) {
            personService.remove(id)
            .then(() => {
                setPersons(persons.filter(p => p.id !== id))
                setMsg({ msg: `Successfully removed from the phonebook`, type: 's' })
                setInterval(() => {
                    setMsg(null)
                }, 5000)
            })
            .catch(() => {
                setMsg({ msg: `The contact has already been removed from the phonebook`, type: 'e' })
                setInterval(() => {
                    setMsg(null)
                }, 5000)
            })
        }
    }

    const personsToShow = persons.filter(p => p.name.match(new RegExp(search, 'i')))

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification msg={msg} />
            <br />
            <Filter search={search} handleSearchChange={handleSearchChange} />
            <h3>Add New</h3>
            <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
            <h2>Numbers</h2>
            <Persons persons={personsToShow} removePerson={removePerson} />
        </div>
    )
}

export default App