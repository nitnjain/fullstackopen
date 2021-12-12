describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.request('POST', 'http://localhost:3003/api/users', {
      username: 'test', name: 'Test User', password: 'password'
    })
    cy.visit('http://localhost:3000')
  })

  it('login form is displayed', function() {
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('login Function', function() {
    it('succeeds when using valid login', function() {
      cy.login({ username: 'test', password: 'password' })

      cy.contains('Logged in as Test User')
    })

    it('fails when using invalid login', function() {
      cy.login({ username: 'test', password: 'pass' })

      cy.get('#errorMessage').should('contain', 'Invalid username/password')
      cy.get('#errorMessage').should('have.css', 'background-color', 'rgb(244, 67, 54)')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.request('POST', 'http://localhost:3003/api/login', { username: 'test', password: 'password' })
        .then(response => {
          localStorage.setItem('loggedAppUser', JSON.stringify(response.body))
          cy.visit('http://localhost:3000')
        })
    })

    it('a blog can be created', function() {
      cy.createBlog({ title: 'A blog title could be anything', author: 'Nitin', url: 'https://testingablog.com' })

      cy.get('#successMessage').should('have.css', 'background-color', 'rgb(76, 175, 80)')
      cy.get('#successMessage').should('contain', 'Added new blog')

      cy.get('#allBlogsContainer').should('contain', 'A blog title could be anything - Nitin')
    })

    describe('when a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({ title: 'An existing blog item', author: 'Nitin', url: 'https://testingablog.com' })
      })

      it('the blog can be liked', function() {
        cy.get('#allBlogsContainer').contains('An existing blog item').contains('view').click()
        cy.contains('like').click()
      })

      it('the blog can be deleted', function() {
        cy.get('#allBlogsContainer').contains('An existing blog item').contains('view').click()
        cy.contains('remove').click()
      })

      it('the blog can not be deleted by other users', function() {
        cy.contains('logout').click()

        cy.request('POST', 'http://localhost:3003/api/users', {
          username: 'other',
          name: 'Other User',
          password: 'otherpass'
        })

        cy.login({ username: 'other', password: 'otherpass' })

        cy.get('#allBlogsContainer').contains('An existing blog item').contains('view').click()
        cy.get('#allBlogsContainer').contains('An existing blog item').should('not.contain', 'remove')
      })
    })

    describe('when multiple blogs exists', function() {
      it('blogs are ordered by likes (high to low)', function() {

        const sampleBlogs = [
          { title: 'Sample Blog 1', author: 'George', url: 'https://testingblog' },
          { title: 'Sample Blog 2', author: 'Jennie', url: 'https://testingblog' },
          { title: 'Sample Blog 3', author: 'Wookie', url: 'https://testingblog' }
        ]

        let blogLikes = []

        sampleBlogs.forEach(blog => {
          cy.createBlog(blog)

          let likes = Math.floor(Math.random() * (15))
          blogLikes.push(likes)

          cy.get('#allBlogsContainer').contains(blog.title).contains('view').click()

          while(likes > 0) {
            cy.get('#allBlogsContainer').contains(blog.title).parent().contains('like').click()
            cy.wait(500)
            likes -= 1
          }
        })

        const highestLikeIndex = blogLikes.indexOf(Math.max(...blogLikes))

        cy.visit('http://localhost:3000')

        cy.get('#allBlogsContainer').contains(sampleBlogs[highestLikeIndex].title).parent().as('highest')
        cy.get('@highest').contains('view').click()
        cy.get('@highest').contains(`Likes: ${Math.max(...blogLikes)}`)
      })
    })
  })
})