import React, { forwardRef, useImperativeHandle, useState } from 'react'

const BlogForm = forwardRef(({ createBlog }, ref) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleAddBlog = (e) => {
    e.preventDefault()

    const blogObject = { newTitle, newAuthor, newUrl }
    createBlog(blogObject)
  }

  useImperativeHandle(ref, () => {
    return {
      clearInputs
    }
  })

  const clearInputs = () => {
    setNewAuthor('')
    setNewTitle('')
    setNewUrl('')
  }

  return (
    <div>
      <h1>Add a new blog</h1>
      <form onSubmit={handleAddBlog}>
        Title: <input id="title" type="text" value={newTitle} onChange={({ target }) => setNewTitle(target.value)} /><br />
        Author: <input id="author" type="text" value={newAuthor} onChange={({ target }) => setNewAuthor(target.value)} /><br />
        URL: <input id="url" type="text" value={newUrl} onChange={({ target }) => setNewUrl(target.value)} /><br />
        <button id="addBlogBtn" type="submit">Add</button>
      </form>
    </div>
  )
})

BlogForm.displayName = 'BlogForm'

export default BlogForm