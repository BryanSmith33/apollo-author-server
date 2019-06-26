const { ApolloServer, gql } = require('apollo-server-express')
const express = require('express')
const app = express()

const books = [
	{ title: 'Harry Potter and the sorcerers stone', authorID: 0, id: 0 },
	{ title: 'Where The Wild Things Are', authorID: 1, id: 1 },
	{ title: 'Go Dog Go!', authorID: 2, id: 2 },
	{ title: 'Harry Potter and the goblet of fire', authorID: 0, id: 3 }
]
const authors = [
	{ name: 'JK Rowling', id: 0 },
	{ name: 'Maurice Sendak', id: 1 },
	{ name: 'PD Eastman', id: 2 }
]

const typeDefs = gql`
	type Book {
		title: String
		author: String
	}

	type Author {
		name: String
		books: [Book]
	}

	type Query {
		getBooks: [Book]
		getBook(id: Int!): Book
		getAuthors: [Author]
		getAuthor(id: Int!): Author
	}

	type Mutation {
		addAuthor(name: String!, id: Int!): Author
		addBook(title: String!, authorID: Int!, id: Int!): Book
	}
`

const resolvers = {
	Query: {
		getBooks: () => books,
		getBook: (_, { id }) => {
			return books.filter((book) => book.id === id)[0]
		},
		getAuthors: () => authors,
		getAuthor: (_, { id }) => {
			return authors.filter((author) => author.id === id)[0]
		}
	},
	Mutation: {
		addAuthor: (_, { name, id }) => {
			authors.push({ name, id })
			return authors[authors.length - 1]
		},
		addBook: (_, { title, authorID, id }) => {
			books.push({ title, authorID, id })
			return books[books.length - 1]
		}
	},
	Author: {
		books: (parent) => {
			return books.filter((book) => {
				if (book.authorID === parent.id) {
					return book.title
				}
			})
		}
	},
	Book: {
		author: (parent) => {
			return authors.filter((author) => author.id == parent.authorID)[0].name
		}
	}
}

const server = new ApolloServer({ typeDefs, resolvers })

server.applyMiddleware({ app, path: '/graphql' })

const PORT = 3333
app.listen(PORT, () => console.log(`magic is happening on ${PORT}/graphql 💋`))
