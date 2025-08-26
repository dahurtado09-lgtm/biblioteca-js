// 1. Crear libro
function createBook(title, author, genre, isbn){
    const timestamp = Date.now();
    return {
        id : timestamp, 
        createdAt: new Date(timestamp).toLocaleString(), 
        title: title,
        author: author,
        genre: genre, 
        isbn: isbn,
        isAvailable: true,
        borrowedby: null,  
        borrowedAt: null, 
        dueDate: null, 
    };
}

// 2. Añadir libro nuevo a la biblioteca
function addBookToLibrary(books, title, author, genre, isbn){
    const newBook = createBook(title, author, genre, isbn);
    books.push(newBook);
    return newBook; 
}

let library = []; 
let borrowedBooks = new Map(); 

//  libros 
let libro1 = addBookToLibrary(library, "Doctor Sueño", "Stephen King", "Terror", "978-958-5579-28-6");
let libro2 = addBookToLibrary(library, "El Resplandor", "Stephen King", "Terror", "978-958-8789-77-4");
let libro3 = addBookToLibrary(library, "Cien Años de Soledad", "Gabriel García Márquez", "Realismo Mágico", "978-0307474728");

console.log("Biblioteca inicial:", library);

// 3. Remover libro
let libroEliminado = removeBookFromLibrary(library, libro1.id);
console.log("Libro eliminado:", libroEliminado);
console.log("Biblioteca después de eliminar:", library);

function removeBookFromLibrary(books, id){
    const index = books.findIndex(book => book.id === id);
    if (index !== -1) {
        const removed = books.splice(index, 1);
        return removed[0];
    }
    return null;
}

// 4. Prestar libro
let prestamo = borrowBook(library, borrowedBooks, libro2.id, "Juan Pérez", 7);
console.log("Resultado del préstamo:", prestamo);

function borrowBook(books, borrowedBooks, bookId, borrowerName, days = 14) {
    let book = books.find(b => b.id === bookId);
    if (!book) return { success: false, message: "El libro no existe en la biblioteca" };
    if (!book.isAvailable) return { success: false, message: "El libro ya está prestado" };

    book.isAvailable = false;
    book.borrowedby = borrowerName;
    book.borrowedAt = new Date();
    let dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);
    book.dueDate = dueDate;

    borrowedBooks.set(bookId, book);
    return { success: true, message: "El libro fue prestado correctamente", book, dueDate };
}

// 5. Devolver libro
let devolucion = returnBook(library, borrowedBooks, libro2.id);
console.log("Devolución del libro:", devolucion);

function returnBook(books, borrowedBooks, bookId) {
    if (!borrowedBooks.has(bookId)) {
        return { success: false, message: "El libro no está registrado como prestado.", fine: 0 };
    }
    let book = borrowedBooks.get(bookId);
    let today = new Date();
    let fine = 0;
    if (today > book.dueDate) {
        let retrasoDias = Math.floor((today - book.dueDate) / (1000 * 60 * 60 * 24));
        fine = retrasoDias * 1000;
    }
    book.isAvailable = true;
    book.borrowedby = null;
    book.borrowedAt = null;
    book.dueDate = null;
    borrowedBooks.delete(bookId);
    return { success: true, message: "El libro fue devuelto correctamente.", fine };
}

// 6. Calcular multa
let multa = calculateFine(new Date("2025-08-10"), 1000);
console.log("Multa calculada:", multa);

function calculateFine(dueDate, fineRate = 0.50) {
    let today = new Date(); 
    let fine = 0;
    if (today > dueDate) {
        let retrasoDias = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
        fine = retrasoDias * fineRate;
    }
    return fine;
}

// 7. Buscar libros
let busqueda = searchBooks(library, "Stephen King");
console.log("Resultados de búsqueda:", busqueda);

function searchBooks(books, criteria) {
    let search = criteria.toLowerCase();
    return books.filter(book =>
        book.title.toLowerCase().includes(search) ||
        book.author.toLowerCase().includes(search) ||
        book.genre.toLowerCase().includes(search)
    );
}

// 8. Libros por genero
let genero = getBooksByGenre(library, "Terror");
console.log("Libros de Terror:", genero);

function getBooksByGenre(books, genre) {
    let search = genre.toLowerCase();
    return books.filter(book => book.genre.toLowerCase() === search);
}

// 9. Libros atrasados
let atrasados = getOverdueBooks(borrowedBooks, 1000);
console.log("Libros atrasados:", atrasados);

function getOverdueBooks(borrowedBooks, fineRate = 0.50) {
    let overdue = [];
    let today = new Date();
    for (let [id, book] of borrowedBooks) {
        if (book.dueDate < today) {
            let fine = calculateFine(book.dueDate, fineRate);
            overdue.push({
                id: book.id,
                title: book.title,
                borrower: book.borrowedby,
                dueDate: book.dueDate,
                fine: fine
            });
        }
    }
    return overdue;
}

// 10. Estadisticas
let reporte = generateLibraryReport(library, borrowedBooks);
console.log("Reporte de la biblioteca:", reporte);

function generateLibraryReport(books, borrowedBooks) {
    let totalBooks = books.length;
    let borrowedCount = borrowedBooks.size;
    let availableCount = books.filter(b => b.isAvailable).length;
    let overdue = getOverdueBooks(borrowedBooks);
    let overdueCount = overdue.length;
    let totalFines = overdue.reduce((sum, book) => sum + book.fine, 0);

    return {
        totalBooks,
        borrowedBooks: borrowedCount,
        availableBooks: availableCount,
        overdueBooks: overdueCount,
        totalFines
    };
}
