const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";


function isStorageExist(){
  if (typeof (Storage) === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;  
}
document.addEventListener("DOMContentLoaded", function () {
  const submitform = document.getElementById("bookForm");
  submitform.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
});

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = document.getElementById("bookFormYear").value;
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    title,
    author,
    year,
    isComplete,
    false,
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function makeBook(bookObject) {
  const bookItemTitle = document.createElement("h3");
  bookItemTitle.innerText = bookObject.title;

  const bookItemAuthor = document.createElement("p");
  bookItemAuthor.innerText = bookObject.author;

  const bookItemYear = document.createElement("p");
  bookItemYear.innerText = bookObject.year;

  const textcontainer = document.createElement("div");
  textcontainer.classList.add("inner");
  textcontainer.append(bookItemTitle, bookItemAuthor, bookItemYear);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textcontainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const iscompletebutton = document.createElement("button");
    iscompletebutton.classList.add("undo-button");
    iscompletebutton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    container.append(iscompletebutton, deleteButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");
    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });
    container.append(checkButton);
  }

  return container;
}

function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookId) {
  for (const bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

document.addEventListener(RENDER_EVENT, function () {
  const incompletedBOOKList = document.getElementById("incompleteBookList");
  incompletedBOOKList.innerHTML = "";

  const completeBOOKList = document.getElementById("completeBookList");
  completeBOOKList.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (!bookItem.isComplete) {
      incompletedBOOKList.append(bookElement);
    } else {
      completeBOOKList.append(bookElement);
    }
  }
});

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

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

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});