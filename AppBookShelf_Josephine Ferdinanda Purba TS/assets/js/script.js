const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';
const books = [];
const RENDER_EVENT = 'render-book';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
      }
  });

  function addBook() {
    const textBook = document.getElementById('titleBook').value;
    const author = document.getElementById('authorBook').value;
    const year = document.getElementById('yearBook').value;
    const isCompleted = document.getElementById("inputBookIsComplete").checked;
  
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, textBook,author, year, isCompleted);
    books.push(bookObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function generateId() {
    return +new Date();
  }

  function generateBookObject(id, titleBook, authorBook, yearBook, isCompleted) {
    return {
      id,
      titleBook,
      authorBook,
      yearBook,
      isCompleted
    }
  }

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';
 
    const completedBOOKList = document.getElementById('completed-books');
    completedBOOKList.innerHTML = '';
   
    for (const bookItem of books) {
      const bookElement = makeBook(bookItem);
      if (!bookItem.isCompleted)
        uncompletedBOOKList.append(bookElement);
      else
        completedBOOKList.append(bookElement);
    }
  });

  function makeBook(bookObject) {
    const textTitleBook = document.createElement('h2');
    textTitleBook.innerText = bookObject.titleBook;
   
    const textAuthorBook = document.createElement('p');
    textAuthorBook.innerText = "Penulis = " + bookObject.authorBook;

    const numberYearBook = document.createElement('p');
    numberYearBook.innerText = "Tahun Terbit = " + bookObject.yearBook;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitleBook, textAuthorBook, numberYearBook);
   
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);
    
    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
     
        undoButton.addEventListener('click', function () {
          undoTaskFromCompleted(bookObject.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(bookObject.id);
        });
     
        container.append(undoButton, trashButton);
      } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        
        checkButton.addEventListener('click', function () {
          addTaskToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
     
        trashButton.addEventListener('click', function () {
          removeTaskFromCompleted(bookObject.id);
        });
        
        container.append(checkButton,trashButton);
      }

    return container;
  }
  
    function addTaskToCompleted (bookId) {
        const bookTarget = findTBook(bookId);
    
        if (bookTarget == null) return;
    
        bookTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findTBook(bookId) {
        for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
        }
        return null;
    }

    function removeTaskFromCompleted(bookId) {
        const bookTarget = findTBookIndex(bookId);
    
        if (bookTarget === -1) return;
    
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
   
   
    function undoTaskFromCompleted(bookId) {
        const bookTarget = findTBook(bookId);
    
        if (bookTarget == null) return;

        bookTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findTBookIndex(bookId) {
        for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
        }   
        return -1;
    }

    function saveData() {
        if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
        }
    }

 
    function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
    }

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
   
    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }
   document.dispatchEvent(new Event(RENDER_EVENT));
  }

