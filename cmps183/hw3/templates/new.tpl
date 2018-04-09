% rebase('base.tpl')

<div class="content">
    <h1>Todo Form</h1>
    <hr>
    <form id="upload" style="margin-top: 20px;" action="/new" method="POST">
        <label class="input">
            Title
            <input id="titleIn" form="upload" name="title" type="text" onkeypress="handleKey(event)">
        </label>
        <label class="input">
            Note
            <input id="noteIn" form="upload" name="note" type="text" onkeypress="handleKey(event)">
        </label>
        <label class="input">
            Due
            <input id="dueIn" form="upload" name="due" type="date" onkeypress="handleKey(event)">
        </label>
        <div class="button" onclick="addTodo()">
            Submit
        </div>
        <span id="warning" class="hidden" style="color: red">
            Please enter the title!
        </span>
    </form>
    <script>
        const warning = document.getElementById('warning');
        const form = document.getElementById('upload')
        function handleKey(event) {
            if (event.key === 'Enter')
                addTodo();
        }
        function addTodo() {
            const titleIn = document.getElementById('titleIn'),
                noteIn = document.getElementById('noteIn'),
                dueIn = document.getElementById('dueIn');
            if (titleIn.value === '') {
                warning.classList.remove('hidden');
                return;
            }

            warning.classList.add('hidden');
            form.submit();
        }
    </script>
</div>