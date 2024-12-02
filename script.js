//Toggle Menu
//Elements
const toggleMenuBtn = document.querySelector(".toggle-menu");
const sidebar = document.querySelector(".sidebar");
//Events
toggleMenuBtn.addEventListener("click", () => {
	sidebar.classList.toggle("open-sidebar");
});

//Start Note Buttons Events
//Elements
const notes = document.querySelectorAll(".note");
const modalWindow = document.querySelector(".modal-window");
const deleteBtns = document.querySelectorAll(".delete-btn");
//Functions
const startNoteButtonsEvents = () => {
	const newNotes = document.querySelectorAll(".note");
	newNotes.forEach((note) => {
		note.addEventListener("mouseenter", () => {
			note.classList.add("active");
		});
		note.addEventListener("mouseleave", () => {
			note.classList.remove("active");
		});
	});
    const newDeleteBtns = document.querySelectorAll(".delete-btn");
    newDeleteBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const savedNotes = getSavedNotes();
            const dataID = btn.parentElement.parentElement.getAttribute("data-id");
            const newNotes = savedNotes.filter((note) => note.id != dataID);
            localStorage.setItem("notes", JSON.stringify(newNotes));
            loadNotes()
        });
    });
    const newCopyBtns = document.querySelectorAll(".copy-btn");
    newCopyBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const noteContent = btn.parentElement.parentElement.querySelector("textarea").textContent;
            createNote(noteContent);
            loadNotes()
        });
    });
    const newPinBtns = document.querySelectorAll(".pin-btn");
    newPinBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            const savedNotes = getSavedNotes();
            const dataID = Number(btn.parentElement.getAttribute("data-id"));
            console.log(typeof dataID)
            savedNotes.forEach((note) => {
                if (note.id === dataID) {
                    note.pinned = !note.pinned;
                }
            })
            localStorage.setItem("notes", JSON.stringify(savedNotes));
            loadNotes()
        });
    });
    newPinBtns.forEach((btn) => {
        const note = btn.parentElement;
        const dataID = Number(note.getAttribute("data-id"));
        const savedNotes = getSavedNotes();
        if (savedNotes.find((note) => note.id === dataID).pinned) {
            btn.classList.add("fixed");
        }
    })
    const newNoteTextareas = document.querySelectorAll("textarea");
    newNoteTextareas.forEach((textarea) => {
        textarea.addEventListener("input", () => {
            const savedNotes = getSavedNotes();
            const dataID = Number(textarea.parentElement.getAttribute("data-id"));
            savedNotes.forEach((note) => {
                if (note.id === dataID) {
                    note.content = textarea.value;
                }
            })
            localStorage.setItem("notes", JSON.stringify(savedNotes));
        });
    });
};

//Create Note
//Elements
const openCreateNoteModal = document.querySelector(".create");
const createNoteBtn = document.querySelector(".create-note-btn");
const noteContentInput = document.querySelector(".note-content-input");
const notesContainer = document.querySelector(".notes-container");
//Functions
const getSavedNotes = () => {
    const notes = JSON.parse(localStorage.getItem("notes")) || [];
    return notes
}
const saveNote = (noteData) => {
    const savedNotes = getSavedNotes()
    savedNotes.push(noteData);
    localStorage.setItem("notes", JSON.stringify(savedNotes))
}
const createNote = (noteContent) => {
    const noteData = {
        content: noteContent,
        pinned: false,
        id: Math.floor(Math.random() * 1000),
    }
    saveNote(noteData);
    loadNotes();
}
const cleanNotes = () => {
    document.querySelector(".notes-container").innerHTML = "";
}
const loadNotes = () => {
    cleanNotes();
    const savedNotes = getSavedNotes();
    savedNotes.sort((a, b) => a.pinned < b.pinned ? 1 : -1);
    if (savedNotes.length === 0) return;
    savedNotes.forEach((savedNote) => {
        const note = document.createElement("div");
	note.classList.add("note");
    note.setAttribute("data-id", savedNote.id);
    const fixed = savedNote.pinned
	note.innerHTML = `
        <div class="decoration"></div>
        <textarea>${savedNote.content}</textarea>
        <button class="pin-btn">
            <i class="fa-solid fa-thumbtack"></i>
        </button>
        <div class="btn-group">
            <button class="copy-btn">
                <i class="fa-solid fa-copy"></i>
            </button>
            <button class="delete-btn">
                <i class="fa-solid fa-x"></i>
            </button>
        </div>`;
	notesContainer.appendChild(note);
    })
    startNoteButtonsEvents();
}
loadNotes();
//Events
openCreateNoteModal.addEventListener("click", () => {
	modalWindow.classList.add("open-modal");
	modalWindow.addEventListener("click", (e) => {
		if (e.target.classList.contains("modal-window")) {
			modalWindow.classList.remove("open-modal");
		}
	});
});
createNoteBtn.addEventListener("click", (e) => {
	e.preventDefault();
    if (!noteContentInput.value) return;
    createNote(noteContentInput.value);
    noteContentInput.value = "";  
    modalWindow.classList.remove("open-modal");
});

//Search
//Elements
const searchBar = document.querySelector(".search-bar");
const searchInput = document.querySelector(".search-input");
//Events
searchInput.addEventListener("input", () => {
    const savedNotes = getSavedNotes();
    const searchValue = searchInput.value.toLowerCase();
    savedNotes.forEach((note) => {
        const noteContent = note.content.toLowerCase();
        const noteElement = document.querySelector(`[data-id="${note.id}"]`);
        if (noteContent.includes(searchValue)) {
            noteElement.style.display = "flex";
        } else {
            noteElement.style.display = "none";
        }
    })
})

//CSV Exporting
//Elements
const csvBtn = document.querySelector(".csv-btn");
//Functions
const downloadCSV = (data) => {

}
//Events
csvBtn.addEventListener("click", () => {
    const savedNotes = getSavedNotes()
    const csvString = [
        ["Id","Content", "Pinned"], 
        ...savedNotes.map((note) => [note.id, note.content, note.pinned]),
    ].map((e) => e.join(",")).join("\n");
    console.log(csvString)
    const link = document.createElement("a");
    link.target = "_blank";
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csvString);
    link.download = "notes.csv";
    link.click()
})
