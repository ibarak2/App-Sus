import { bookService } from '../services/books.service.js'
import { BookList } from '../cmps/book-list.jsx'
import { BookFilter } from '../cmps/book-filter.jsx'
import { AddBook } from '../cmps/add-book.jsx'

export class BookApp extends React.Component {

    state = {
        books: [],
        filterBy: null,

    }

    componentDidMount() {
        this.loadBooks()
    }

    loadBooks = () => {
        bookService.query(this.state.filterBy)
            .then((res) => {
                this.setState({ books: res }, () => {
                    console.log("state has finished loading");
                    console.log(this.state);
                })
            })

    }

    onSetFilter = (filterBy) => {
        this.setState({ filterBy }, () => {
            this.loadBooks()
        })
    }


    render() {
        const { books } = this.state

        return <section>
            <h1>Book Shop Home-page</h1>
            <div className='flex align-center space-evenly'>
                <AddBook />
                <BookFilter onSetFilter={this.onSetFilter} />
            </div>

            <BookList books={books} />


        </section>

    }
}