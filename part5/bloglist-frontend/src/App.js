import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  //User mgmt
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormTogglableRef = useRef()
  const blogFormRef = useRef()


  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserString = window.localStorage.getItem('loggedAppUser')
    if(loggedUserString) {
      const userObj = JSON.parse(loggedUserString)

      blogService.setToken(userObj.token)
      setUser(userObj)
    }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userObj = await loginService.login({ username, password })

      blogService.setToken(userObj.token)
      window.localStorage.setItem('loggedAppUser', JSON.stringify(userObj))
      setUser(userObj)
    } catch(exception) {
      setErrorMessage('Invalid username/password')
      setInterval(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = (e) => {
    e.preventDefault()

    window.localStorage.removeItem('loggedAppUser')
    setUser(null)
  }

  const likeBlog = (id) => {
    const blogObj = blogs.find(b => b.id === id)

    blogService
      .like(id, blogObj)
      .then(updatedBlog => {
        setBlogs(blogs.map(b => b.id === id ? updatedBlog : b))
      })
  }

  const deleteBlog = (id) => {
    blogService
      .remove(id)
      .then(() => {
        setBlogs(blogs.filter(b => b.id !== id))
      })
  }

  const createBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(savedBlog => {
        blogFormTogglableRef.current.toggleVisible()
        blogFormRef.current.clearInputs()

        savedBlog.user = {
          name: user.name,
          username: user.username
        }

        setBlogs(blogs.concat(savedBlog))

        setSuccessMessage(`Added new blog - ${savedBlog.title}`)
        setInterval(() => {
          setSuccessMessage(null)
        }, 5000)
      }).catch(e => {
        console.log(e)
        setErrorMessage('Could not add blog')
        setInterval(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const messageContainer = () => {
    const msgStyle = {
      fontWeight: 800,
      padding: 10
    }

    const errorMsg = {
      backgroundColor: '#f44336',
      color: '#212121'
    }

    const successMsg = {
      backgroundColor: '#4caf50',
      color: '#212121'
    }

    if(errorMessage !== null) {
      return (
        <div style={Object.assign({}, msgStyle, errorMsg)} id="errorMessage">
          {errorMessage}
        </div>
      )
    }

    if(successMessage !== null) {
      return (
        <div style={Object.assign({}, msgStyle, successMsg)} id="successMessage">
          {successMessage}
        </div>
      )
    }
  }

  const blogsContent = () => (
    <div>
      <h2>blogs</h2>
      Logged in as {user.name} <button onClick={handleLogout}>logout</button><br /><br />
      <div id='allBlogsContainer'>
        {blogs.sort((a, b) => b.likes - a.likes).map(blog =>
          <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} currentUser={user.username} />
        )}
      </div>
    </div>
  )

  if(user === null) {
    return (
      <div>
        {messageContainer()}
        <LoginForm
          handleLogin={handleLogin}
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
        />
      </div>
    )
  }

  return (
    <div>
      {messageContainer()}
      {blogsContent()}
      <Togglable btnLabel="Add a blog" ref={blogFormTogglableRef}>
        <BlogForm createBlog={createBlog} ref={blogFormRef} />
      </Togglable>
    </div>
  )
}

export default App