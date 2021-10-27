import React from 'react'
import Course from './components/Course'
  
const App = () => {
	const courses = [{
		id: 1,
		name: 'Half Stack application development',
		parts: [
			{
				name: 'Fundamentals of React',
				exercises: 10,
				id: 1
			},
			{
				name: 'Using props to pass data',
				exercises: 7,
				id: 2
			},
			{
				name: 'State of a component',
				exercises: 14,
				id: 3
			},
			{
				name: 'Redux',
				exercises: 9,
				id: 4
			}
		]
	}]
  
	return (
	  	<div>
			{courses.map(course => <Course course={course} />)}
	  	</div>
	)
}

export default App