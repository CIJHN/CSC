import sqlite3 as sql
import uuid
from time import time, ctime
from bottle import route, view, run, template, static_file, template, TEMPLATE_PATH, request, get, post, redirect, response

TEMPLATE_PATH.append('./templates')
conn = sql.connect('./database.db')
c = conn.cursor()
c.execute('''CREATE TABLE 
            IF NOT EXISTS todos
             (id text PRIMARY KEY,
             title text,
             note text,
             status integer,
             post integer,
             updated integer,
             due integer)''')


def formatTodo(todo):
    todoList = list(todo)
    todoList[4] = ctime(todoList[4] / 1000)
    todoList[5] = ctime(todoList[5] / 1000)
    if todoList[6] is not u'':
        todoList[6] = ctime(todoList[6] / 1000)
    return todoList


def fetchTodos(_filter, sort, order):
    cur = conn.cursor()
    query = 'SELECT * FROM todos ORDER BY {0} {1}' if _filter == 'all' else 'SELECT * FROM todos WHERE status=? ORDER BY {0} {1}'
    query = query.format(sort, order)
    cur.execute(query) if _filter == 'all' else cur.execute(
        query, (0 if _filter == 'todos' else 1, ))
    return cur.fetchall()


def editTodo(id, title, note, status, due):
    status = 1 if status == u'on' else 0
    cur = conn.cursor()
    update = time() * 1000
    cur.execute(
        'UPDATE todos SET title=?, note=?, status=?, updated=?, due=? WHERE id=?',
        (title, note, status, update, due, id))
    conn.commit()


def newTodo(title, note, due):
    uid = str(uuid.uuid4())
    cur = conn.cursor()
    post = time() * 1000
    update = time() * 1000
    status = 0
    cur.execute('INSERT INTO todos VALUES(?,?,?,?,?,?,?)',
                (uid, title, note, status, post, update, due))
    conn.commit()


class Course:
    def __init__(self, number, title, year, department, quater):
        self.number = number
        self.title = title
        self.year = year
        self.department = department
        self.quater = quater


class SideBarItem:
    def __init__(self, icon, title, content):
        self.icon = icon
        self.title = title
        self.content = content


courses = [
    Course(0, 'W', 128674521, 'ALU', 'spring'),
    Course(1, 'O', 123879, 'AM', 'fall'),
    Course(2, 'W', 29470, 'SM', 'winter')
]


@route('/')
@route('/index')
def index():
    return template(
        'index',
        dict(
            courseList=courses,
            sidebarItems=[
                SideBarItem('account_circle', 'About Myself',
                            'Well... actually nothing here'),
                SideBarItem(
                    'apps', 'This app',
                    'This app use python bottle framework to build the backend)'
                ),
                SideBarItem(
                    'assignment', 'About the assignment',
                    'The assignment actually provide such a free condition...')
            ]))


@route('/list')
def _list():
    query = request.query
    cookies = request.cookies
    filterKey = str(query.filter) if query.filter != u'' else str(
        cookies.filter) if cookies.filter != u'' else 'all'
    sortKey = str(query.sort) if query.sort != u'' else str(
        cookies.sort) if cookies.sort != u'' else 'post'
    orderKey = str(query.order) if query.order != u'' else str(
        cookies.order) if cookies.order != u'' else 'ASC'

    response.set_cookie('filter', filterKey)
    response.set_cookie('sort', sortKey)
    response.set_cookie('order', orderKey)

    todos = fetchTodos(filterKey, sortKey, orderKey)
    todos = map(formatTodo, todos)
    return template(
        'list',
        dict(
            sidebarItems=[
                SideBarItem('account_circle', 'About the Todo list',
                            'The list is fine... but actual implementation is kind of complicated.'),
                SideBarItem(
                    'apps', 'The sort function',
                    "The DB do the sort for me lol"
                ),
                SideBarItem(
                    'assignment', 'About the time display',
                    'This is the most hard part of the app. Sync the date format between JS and python is really.... annoying')
            ],
            todoItems=todos,
            sort=sortKey,
            order=orderKey,
            filter=filterKey))


@post('/toggle/<id>')
def _toggle(id):
    cur = conn.cursor()
    cur.execute('SELECT status FROM todos WHERE id=?', (id, ))
    bit = cur.fetchone()[0]
    print(bit, type(bit))
    bit = 1 if bit == 0 else 0
    cur.execute('UPDATE todos SET status=? WHERE id = ?', (bit, id))
    conn.commit()
    return redirect('/list')


@post('/new')
def newPost():
    title = request.forms['title']
    note = request.forms['note']
    due = request.forms['due']
    newTodo(title, note, due)
    return redirect('/list')


@post('/edit/<id>')
def edit(id):
    title = request.forms.get('title')
    note = request.forms.get('note')
    due = request.forms.get('due')
    status = request.forms.get('status')
    editTodo(id, title, note, status, due)
    return redirect('/list')


@post('/delete/<id>')
def delete(id):
    cur = conn.cursor()
    cur.execute('DELETE FROM todos WHERE id=?', (id, ))
    return redirect('/list')


@route('/scripts/<script>')
def scripts(script):
    return static_file(script, './scripts')


@get('/fonts/roboto/<f>')
def font(f):
    return static_file(f, './fonts/roboto/')


@route('/css/<css>')
def css(css):
    return static_file(css, './css')


def renderCourse(course):
    return template(
        '''
        <li class="course">
            <div class="elem number">{{number}}</div>
            <div class="elem">{{year}}</div>
            <div class="elem">{{quater}}</div>
            <div class="right elem">{{title}}</div>
            <div class="elem">{{department}}</div>
        </li>
    ''',
        number=course.number,
        year=course.year,
        title=course.title,
        department=course.department,
        quater=course.quater)


run(host='localhost', port=8080)
