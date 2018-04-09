% rebase('base.tpl')

<div class="content">
    <div class="row">
        <form id="sortForm" action="/list" method="GET" class="col s12">
            <div class="row">
                <div class="input-field col s3">
                    <select name="sort" onchange="update()">
                        <option value="post" {{! 'selected' if sort=='post' else ''}}>Post Date</option>
                        <option value="due" {{! 'selected' if sort=='due' else ''}}>Due Date</option>
                        <option value="updated" {{! 'selected' if sort=='updated' else ''}}>Last Updated</option>
                    </select>
                    <label>Sort</label>
                </div>
                <div class="input-field col s3">
                    <select name="order" onchange="update()">
                        <option value="ASC" {{! 'selected' if order=='ASC' else ''}}>Ascending</option>
                        <option value="DESC" {{! 'selected' if order=='DESC' else ''}}>Descending</option>
                    </select>
                    <label>Sort Order</label>
                </div>
                <div class="input-field col s3">
                    <select name="filter" onchange="update()">
                        <option value="all" {{! 'selected' if filter=='all' else ''}}>Show All</option>
                        <option value="completed" {{! 'selected' if filter=='completed' else ''}}>Show Completed</option>
                        <option value="todos" {{! 'selected' if filter=='todos' else ''}}>Show Todos</option>
                    </select>
                    <label>Filter</label>
                </div>
            </div>
        </form>
        % for i in todoItems:
        <div class="col s12 m12">
            <div class="card blue-grey darken-1 hoverable">
                <div class="card-content white-text">
                    <span class="card-title">{{i[1]}}
                        <span class="right tooltipped" data-position="top" data-tooltip="Due Date">{{i[6]}}</span>
                    </span>
                    <span class="right tooltipped" data-position="top" data-tooltip="Last Updated Date">{{i[5]}}</span>
                    <p>{{i[2]}}</p>
                    <span class="right tooltipped" data-position="top" data-tooltip="Post Date">{{i[4]}}</span>
                </div>
                <div class="card-action">
                    <a class="modal-trigger" href="#edit" {{! """onclick="initEditModal( '%s', '%s', '%s', '%s', '%s') " """ % (i[0], i[1], i[2], i[3], i[6])}}>Edit</a>
                    <a class="modal-trigger" href="#deleteModal" {{! """onclick="initDeleteModal('%s') " """ % (i[0])}}>Delete</a>

                    <a class="right" style="margin-right:0px; cursor:pointer;" {{! """onclick="toggle('%s') " """ % (i[0])}}>{{"Mark As Finish" if i[3] == 0 else "Mark as TODO"}}</a>
                </div>
            </div>
        </div>
        % end
    </div>
    <form id="deleteForm" action="/delete" method="POST"></form>
    <form id="toggleForm" action="/toggle" method="POST"></form>
    <div id="deleteModal" class="modal">
        <div class="modal-content">
            <h4>Deleting todo item...</h4>
            <p>Are you sure to delete this todo item?</p>
        </div>
        <div class="modal-footer">
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">No</a>
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" onclick="ondelete()">Yes</a>
        </div>
    </div>
    <div id="edit" class="modal modal-fixed-footer">
        <div class="modal-content">
            <h4 id="edit-header">Edit the Todo</h4>
            <hr>
            <form id="editForm" action="/edit" method="POST">
                <div class="input-field col s12">
                    <input id="input_title" type="text" name="title" form="editForm" class="validate">
                    <label for="input_title">Title</label>
                </div>
                <div class="input-field col s12">
                    <textarea id="input_note" type="text" name="note" form="editForm" class="materialize-textarea"></textarea>
                    <label for="input_note">Note</label>
                </div>
                <div class="col s6">
                    <label for="input_due_date">Due Date</label>
                    <input id="input_due_date" type="text" class="datepicker">
                </div>
                <div class="col s6">
                    <label for="input_due_time">Due Time</label>
                    <input id="input_due_time" type="text" class="timepicker">
                </div>
                <input id="input_due" type="text" name="due" class="hidden">
                <div class="col s12" style="margin-top:10px;margin-left:5px;">
                    <input type="checkbox" id="input_status" form="editForm" name="status">
                    <label for="input_status">Finish</label>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <a href="#!" class="modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
            <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat" onclick="saveEdit()">Ok</a>
        </div>
    </div>
    <div class="fixed-action-btn">
        <a class="waves-effect waves-light btn-floating btn-large red modal-trigger" href="#edit" onclick="initNewModal()"  >
            <i class="large material-icons">add</i>
        </a>
    </div>
    <script>
        $(document).ready(function () {
            $('.tooltipped').tooltip({ delay: 50, html: true });
            $('select').material_select();
            $('.modal').modal();
            $('.datepicker').pickadate({
                selectMonths: true, // Creates a dropdown to control month
                selectYears: 15, // Creates a dropdown of 15 years to control year,
                today: 'Today',
                clear: 'Clear',
                close: 'Ok',
                closeOnSelect: false // Close upon selecting a date,
            });
            $('.timepicker').pickatime({
                default: 'now', // Set default time: 'now', '1:30AM', '16:30'
                fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
                twelvehour: false, // Use AM/PM or 24-hour format
                donetext: 'OK', // text for done-button
                cleartext: 'Clear', // text for clear-button
                canceltext: 'Cancel', // Text for cancel-button
                autoclose: false, // automatic close timepicker
                ampmclickable: true, // make AM PM clickable
                aftershow: function () { } //Function for after opening timepicker
            });
        });
        function formatDate(date) {
            const monthNames = [
                "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December"
            ];;
            return `${date.getDate()} ${monthNames[date.getMonth()]}, ${date.getFullYear()}`
        }
        function formatTime(date) {
            let hour = date.getHours()
            if (hour < 10) hour = `0${hour}`
            let min = date.getMinutes()
            if (min < 10) min = `0${min}`
            return `${hour}:${min}`
        }
        function initEditModal(id, title, note, status, due) {
            $('#edit-header').text('Editing TODO Item')
            const dateObj = new Date(due);

            const date = formatDate(dateObj)
            const time = formatTime(dateObj)

            $('#input_title').val(title);
            $('#input_note').val(note);
            if (!status)
                $('#input_status').removeAttr('checked')
            else
                $('#input_status').attr('checked', '')
            $('#input_due_date').val(date)
            $('#input_due_time').val(time)

            $('#editForm').attr('action', `edit/${id}`)
            $('#input_note').trigger('autoresize');
            Materialize.updateTextFields();
        }
        function initNewModal() {
            $('#edit-header').text('Creating the New TODO Item')
            $('#input_title').val('');
            $('#input_note').val('');
            $('#input_status').removeAttr('checked')
            $('#input_due_date').val('')
            $('#input_due_time').val('')
            $('#editForm').attr('action', `/new`)
            $('#input_note').trigger('autoresize');
            Materialize.updateTextFields();
        }
        function update() {
            $('#sortForm').submit();
        }
        function saveEdit() {
            const date = $('#input_due_date').val()
            const time = $('#input_due_time').val()
            const epcho = Date.parse(`${date} ${time}`);
            $('#input_due').val(epcho);
            $('#editForm').submit();
        }
        function toggle(id) {
            $('#toggleForm').attr('action', `toggle/${id}`).submit();
        }
        function initDeleteModal(id) {
            $('#deleteForm').attr('action', `delete/${id}`)
        }
        function ondelete() {
            $('#deleteForm').submit()
        }
    </script>
</div>