import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import BlogForm from './BlogForm'

test('blog form calls handler with the right values', () => {
  const createBlog = jest.fn()

  const component = render(
    <BlogForm createBlog={createBlog} />
  )

  fireEvent.change(component.container.querySelector('#title'), { target: { value: 'A blog title' } })
  fireEvent.change(component.container.querySelector('#author'), { target: { value: 'George' } })
  fireEvent.change(component.container.querySelector('#url'), { target: { value: 'http://blogte.st' } })

  const addBtn = component.getByText('Add')
  fireEvent.click(addBtn)

  expect(createBlog.mock.calls[0][0].newTitle).toBe('A blog title')
  expect(createBlog.mock.calls[0][0].newAuthor).toBe('George')
  expect(createBlog.mock.calls[0][0].newUrl).toBe('http://blogte.st')
})