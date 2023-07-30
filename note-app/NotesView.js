export default class NotesView {

    constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}) {

        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML = `
            <div class="notes__sidebar">
                <div class="notes__custom-title">
                    <h3>Note recenti:</h3>
                    <div class="istruzioni">
                        <span class="istr_1">Click per modificare una Nota.</span>
                        <span class="istr_2">Doppio Click per cancellare una Nota.</span>
                    </div>
                </div>
                <div class="notes__list"></div>
                <span class="notes__add" type="button"><i class="fa-solid fa-plus"></i><span class="notes__add-inner">Crea</span></span>
            </div>
            <div class="notes__preview">
                <div class="notes__custom-title">
                    <h3>Scrivi una nota:</h3>
                </div>
                <div class="titleAndSaveBtn">
                    <input class="notes__title" type="text" placeholder="Titolo...">
                    <span class="SalvaBtn">Salva</span>
                </div>
                <label id="invisible-label" for="notes__body">-</label>
                <textarea id="notes__body" class="notes__body" placeholder="Scrivi un Nota..."></textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector(".notes__title");
        const inpBody = this.root.querySelector(".notes__body");

        btnAddNote.addEventListener("click", () => {
            this.onNoteAdd();
        });

        [inpTitle, inpBody].forEach(inputField => {
            inputField.addEventListener("blur", () => {
                const unpdatedTitle = inpTitle.value.trim();
                const unpdatedBody = inpBody.value.trim();

                this.onNoteEdit(unpdatedTitle, unpdatedBody);
            });
        });

        this.updateNotePreviewVisibility(false);

    }

    _createListItemHTML(id, title, body, updated) {
        
        const MAX_BODY_LENGTH = 80;

        return `
            <div class="notes__list-item" data-note-id="${id}">
                <div class="notes__small-container">
                    <div class="notes__small-title">${title}</div>
                    <div class="notes__small-body">
                        ${body.substring(0, MAX_BODY_LENGTH)}
                        ${body.length > MAX_BODY_LENGTH ? "..." : ""}
                    </div>
                </div>
                <div class="notes__small-updated">
                    <span class="notes__small-updated-text">
                        ${updated.toLocaleString(undefined, {dateStyle: "medium", timeStyle: "short"})}
                    </span>
                </div>
            </div>
        `;

    }

    updateNoteList(notes) {
        const notesListContainer = this.root.querySelector(".notes__list");

        // Empty list
        notesListContainer.innerHTML = "";

        for (const note of notes) {
            const html = this._createListItemHTML(note.id, note.title, note.body, new Date(note.updated));

            notesListContainer.insertAdjacentHTML("beforeend", html);
        }

        // Add select/delete events for each list item
        notesListContainer.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.addEventListener("click", () => {
                this.onNoteSelect(noteListItem.dataset.noteId);
            });

            noteListItem.addEventListener("dblclick", () => {
                const doDelete = confirm("Confermi di voler cancellare questa Nota?");

                if (doDelete) {
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            });

        });
        
    }

    updateActiveNote(note) {
        this.root.querySelector(".notes__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem => {
            noteListItem.classList.remove("notes__list-item--selected");
        });

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item--selected");
    }

    updateNotePreviewVisibility(visible) {
        this.root.querySelector(".notes__preview").style.visibility = visible ? "visible" : "hidden";
    }

}