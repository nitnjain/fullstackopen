import React, { useState } from 'react'
const Blog = ({ blog, likeBlog, deleteBlog, currentUser }) => {
  const [expanded, setExpanded] = useState(false)

  const blogStyle = {
    border: 'solid',
    borderWidth: 1,
    padding: 10,
    marginBottom: 5
  }

  const toggleExplanded = () => {
    setExpanded(!expanded)
  }

  const detailsDivStyle = {
    display: expanded ? '' : 'none'
  }

  const sendLike = () => {
    likeBlog(blog.id)
  }

  const removeBlog = () => {
    const confirmRemove = window.confirm('Do you want to remove the blog' + blog.title)
    if(confirmRemove) {
      deleteBlog(blog.id)
    }
  }
  let removeBtn = <></>

  if(blog.user.username === currentUser) {
    removeBtn = <button onClick={removeBlog}>remove</button>
  }

  return (
    <div style={blogStyle}>
      <div className='blogTitleContainer'>
        {blog.title} - {blog.author} <button onClick={toggleExplanded}>{expanded ? 'hide' : 'view'}</button>
      </div>
      <div style={detailsDivStyle} className='blogDetailsContainer'>
        {blog.url}<br />
      Likes: <span className='likesNum'>{blog.likes}</span> <button onClick={sendLike}>like</button><br />
      Added by {blog.user.name}<br />
        {removeBtn}
      </div>
    </div>
  )}

export default Blog