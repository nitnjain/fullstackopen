import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

const sampleBlogObj = {
  title: 'A blog for testing',
  author: 'George',
  likes: 24,
  url: 'https://testi.ng',
  user: {
    username: 'test',
    name: 'Test'
  }
}

test('blog renders title & author', () => {
  const blogObj = { ...sampleBlogObj }
  const component = render(
    <Blog blog={blogObj} />
  )

  expect(component.container.querySelector('.blogTitleContainer')).toHaveTextContent(`${blogObj.title} - ${blogObj.author}`)
})

test('url & likes are shown when blog is expanded', () => {
  const blogObj = { ...sampleBlogObj }
  const component = render(
    <Blog blog={blogObj} />
  )

  const viewBtn = component.getByText('view')
  fireEvent.click(viewBtn)

  const detailsDiv = component.container.querySelector('.blogDetailsContainer')
  expect(detailsDiv).toHaveTextContent(`Likes: ${blogObj.likes}`)
  expect(detailsDiv).toHaveTextContent(`${blogObj.url}`)
})

test('like buttpn clicked twice is recorded', () => {
  const blogObj = { ...sampleBlogObj }
  const likeBlog = jest.fn()

  const component = render(
    <Blog blog={blogObj} likeBlog={likeBlog}/>
  )

  const viewBtn = component.getByText('view')
  fireEvent.click(viewBtn)

  const likeBtn = component.getByText('like')
  fireEvent.click(likeBtn)
  fireEvent.click(likeBtn)

  expect(likeBlog.mock.calls).toHaveLength(2)
})
