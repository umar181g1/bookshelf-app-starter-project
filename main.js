const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";

function isStorageExist() {
  if (typeof Storage === undefined) {
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
  const year = parseInt(document.getElementById("bookFormYear").value);
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
  bookItemTitle.setAttribute("data-testid", "bookItemTitle");
  bookItemTitle.innerText = bookObject.title;

  const bookItemAuthor = document.createElement("p");
  bookItemAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookItemAuthor.innerText = `Penulis: ${bookObject.author}`;

  const bookItemYear = document.createElement("p");
  bookItemYear.setAttribute("data-testid", "bookItemYear");
  bookItemYear.innerText = `Tahun: ${bookObject.year}`;

  const container = document.createElement("div");
  container.setAttribute("data-bookid", bookObject.id);
  container.setAttribute("data-testid", "bookItem");
  container.classList.add("item", "shadow");

  container.append(bookItemTitle, bookItemAuthor, bookItemYear);

  if (bookObject.isComplete) {
    const iscompletebutton = document.createElement("button");
    iscompletebutton.setAttribute("data-testid", "bookItemIsCompleteButton");
    iscompletebutton.innerText = bookObject.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    iscompletebutton.addEventListener("click", function () {
      if (bookObject.isComplete) {
        undoBookFromCompleted(bookObject.id);
      } else {
        addBookToCompleted(bookObject.id);
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.innerText = "Edit Buku";
    editButton.addEventListener("click", function () {
      editbook(bookObject.id);
    });

    container.append(iscompletebutton, deleteButton, editButton);
  } else {
    const iscompletebutton = document.createElement("button");
    iscompletebutton.setAttribute("data-testid", "bookItemIsCompleteButton");
    iscompletebutton.innerText = bookObject.isComplete
      ? "Belum selesai dibaca"
      : "Selesai dibaca";
    iscompletebutton.addEventListener("click", function () {
      if (bookObject.isComplete) {
        undoBookFromCompleted(bookObject.id);
      } else {
        addBookToCompleted(bookObject.id);
      }
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-testid", "bookItemDeleteButton");
    deleteButton.innerText = "Hapus Buku";
    deleteButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    const editButton = document.createElement("button");
    editButton.setAttribute("data-testid", "bookItemEditButton");
    editButton.innerText = "Edit Buku";
    editButton.addEventListener("click", function () {
      editbook(bookObject.id);
    });

    container.append(iscompletebutton, deleteButton, editButton);
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

function editbook(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  document.getElementById("bookFormTitle").value = bookTarget.title;
  document.getElementById("bookFormAuthor").value = bookTarget.author;
  document.getElementById("bookFormYear").value = bookTarget.year;
  document.getElementById("bookFormIsComplete").checked = bookTarget.isComplete;
  
  isedit = true;
  editbookId = bookId;

  const submitform = document.getElementById("bookFormSubmit");

  form.onsubmit = function (event) {
    event.preventDefault();
    if(iseditmode){
        const bookIndex = findBookIndex(editbookId);
        books[bookIndex].title = document.getElementById("bookFormTitle").value;
        books[bookIndex].author = document.getElementById("bookFormAuthor").value;
        books[bookIndex].year = parseInt(document.getElementById("bookFormYear").value);
        books[bookIndex].isComplete = document.getElementById("bookFormIsComplete").checked;

        iseditmode = false;
        editbookId = null;
        document.getElementById("bookFormSubmit").innerText = "Tambah Buku";
        event.target.reset();
    } else {
        addBook();

    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
    updateBook(bookId);
  };

  const submitButton = document.getElementById("bookFormSubmit");
  submitButton.innerText = "Update Buku";
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

document.addEventListener("DOMContentLoaded", function () {
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function updateBook(bookId) {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  books[bookIndex] = {
    id: bookId,
    title,
    author,
    year,
    isComplete,
    status: bookTarget.status,
  };
  resetForm();

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
  alert("Buku berhasil diperbarui");
}

function resetForm() {
  const form = document.getElementById("bookForm");
  form.reset();
  form.onsubmit = null;
  location.reload();
}
