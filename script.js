document.addEventListener('DOMContentLoaded', onload);
function onload() {

let main = document.querySelector('.notes');

// theme option
const theme_toggler = document.querySelector('.cb');
theme_toggler.addEventListener('change', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') 
    ? 'dark' : 'light');
});
function themeChecker()
{
    let theme = localStorage.getItem('theme');
    if (theme == 'dark')
    {
        theme_toggler.checked =
         true;
        document.body.classList.add('dark-theme');
        document.querySelector('.switch').classList.add('dark');
    }
}
//let openRequest = indexedDB.open('notes', 1);

// Subject-checker and load
let subject;
let notes;
function loadSaved() {
    subject = document.getElementById('subject');
    let data = localStorage.getItem(subject.value);
    if (data) {
        main.innerHTML = data;
    }
    else {
        main.innerHTML = `<h2 id="welcome"> Hi! Click on the '+' button to add your first note :)</h2>`;
    }
    notes = main.querySelectorAll('.note_unactive');
    if (notes) {
        for (let note of notes) {
        note.addEventListener('click', make_active);
    }
    }
}
loadSaved();
themeChecker();
subject.addEventListener('change', loadSaved);


// Add note
const add = document.querySelector('.add');
add.addEventListener('click', addNote);
function addNote() {
    if (document.getElementById('welcome') != null)
        main.innerHTML = null;
    main.insertAdjacentHTML('afterbegin', `<div class="note note_unactive"
    spellcheck="true" aria-multiline="true" role="textbox" contenteditable="true">
    </div>`);
    main.firstChild.addEventListener('click', make_active);
};

// Direct interaction()
let panel;
function make_active() {
    this.classList.remove('note_unactive');
    this.classList.add('note_active');
    document.querySelector('.sheet').style.display = 'block';
    addPanel(this);
}
function make_unactive(note) {
    note.classList.remove('note_active');
    note.classList.add('note_unactive');
    panel.style.display = 'none';
    document.querySelector('.sheet').style.display = '';
    notes = main.querySelectorAll('.note_unactive');
    for (let elem of notes) {
        elem.addEventListener('click', make_active);
    };
}

function deleteNote(note)
{
    if(note.classList.contains('note_active'))
        make_unactive(note);
    note.remove();
    localStorage.setItem(subject.value, main.innerHTML);
}

function addPanel(note) {
    main.insertAdjacentHTML('afterend', `<div class='panel'>
    <button class='rm btn tooltip' data-tooltip="Переместить"><span class="rm"></span></button>
    <button class='extra btn tooltip' data-tooltip="Дополнительно"><span class="lst"></span></button>
    <button data-tooltip="Добавить задачи" class='add_ul tooltip btn'><span class="plus submit">&#9675;</span></button>
    <button class='close btn tooltip' data-tooltip="Закрыть"><span class="plus submit">&#10060;</span></button>
    <button class='save btn tooltip' data-tooltip="Сохранить"><span class="plus submit">&#10004;</span></button>
    <button class='delete btn tooltip' data-tooltip="Удалить" title="мусор иконки"><img class='delete__pic' src='img/del.png'></button>
    </div>`
    );
    panel = document.querySelector('.panel');
    //let add_ul = document.querySelector('.add_ul');
    let save = panel.querySelector('.save');
    let del = panel.querySelector('.delete');
    let close = panel.querySelector('.close');
    let remove = panel.querySelector('.rm');
    remove.addEventListener('click', () => {
        console.log(note);
        remove.style.display = 'none';
        panel.insertAdjacentHTML('afterbegin', `<select id="rm_select"
        >${subject.innerHTML}</select>`);
        let rm_select = document.getElementById('rm_select');
        rm_select.style.zIndex = Number(getComputedStyle(note).zIndex) + 1;
        if(rm_select.value != subject.value)
        {
            for(let i = 0; i < rm_select.length; i++)
            {
                if(rm_select[i].value == subject.value)
                {
                    rm_select[i].setAttribute('selected', '');
                }
            }
        }
        rm_select.addEventListener('change', () => {
            
            let newdata = "";
            let dest = localStorage.getItem(rm_select.value);
            make_unactive(note);
            newdata = note.outerHTML;
            newdata += dest;
            localStorage.setItem(rm_select.value, newdata);
            deleteNote(note);
        });
    });
    //let extra = document.querySelector('.extra');
    note.removeEventListener('click', make_active);
    // add_ul.addEventListener('click', () => {
    //     let todo = note.querySelector('.to-do');
    //     if (todo == undefined)
    //     note.insertAdjacentHTML('beforeend', `<ul class="to-do">
    //     <li><input type="checkbox"> <input type="text"></li>
    // </ul>`);
    //     else
    //         todo.insertAdjacentHTML('beforeend', `<li><input type="checkbox">
    //         <input type="text"></li>`);
    // })
    // extra.addEventListener('click', () => {
    //     let cursive = note.querySelector('.crsv');
    //     if (cursive == undefined)
    //         note.insertAdjacentHTML('beforeend', `<i class="crsv">`);
    //     else
    //     note.insertAdjacentHTML('beforeend', `</i>`);
    // })
    save.addEventListener('click', () => {
        make_unactive(note);
        localStorage.setItem(subject.value, main.innerHTML);
    })
    del.addEventListener('click', () => deleteNote(note));
    close.addEventListener('click', () => make_unactive(note));
}
//как после срабатывания события предотвратить само событие временно
//есть ли разница искать от документа или от того что ближе
//update only what changes

//function showSubjectForm()

let subject_form = document.getElementById('subject-form');
subject_form.addEventListener('submit', addNewSubject);
function addNewSubject(ev)
{
    ev.preventDefault();
    let value = document.forms.subject.value.value;
    let title = document.forms.subject.title.value;

    let option = new Option(title, value);
    subject.append(option);
    subject_form.style.display = 'none';
    add_subject.style.display = 'inline';
}

let add_subject = document.getElementById('add_subject');
add_subject.addEventListener('click', () => {
    subject_form.style.display = 'block';
    add_subject.style.display = 'none';
});
}