import sqlite3 as sql
import uuid
from time import time, ctime
from bottle import route, view, run, template, static_file, template, TEMPLATE_PATH, request, get, post, redirect, response
import json

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

def wrapTask(row):
    id, title, note, status, post, updated, due = row
    return {
        'id': id,
        'title': title,
        'note': note,
        'status': status,
        'post': post,
        'update': updated,
        'due': due
    }

def fetchTodos(_filter, sort, order):
    cur = conn.cursor()
    query = 'SELECT * FROM todos ORDER BY {0} {1}' if _filter == 'all' else 'SELECT * FROM todos WHERE status=? ORDER BY {0} {1}'
    query = query.format(sort, order)
    cur.execute(query) if _filter == 'all' else cur.execute(
        query, (0 if _filter == 'todos' else 1, ))
    rows = cur.fetchall()
    return map(wrapTask, list(rows))

def fetchTodo(_id):
    cur = conn.cursor()
    query = 'SELECT * FROM todos WHERE id=?'
    cur.execute(query, (_id, ))
    return wrapTask(cur.fetchone())

def editTodo(id, title, note, due):
    # status = 1 if status == u'on' else 0
    cur = conn.cursor()
    update = time() * 1000
    cur.execute(
        'UPDATE todos SET title=?, note=?, updated=?, due=? WHERE id=?',
        (title, note, update, due, id))
    conn.commit()


def newTodo(title, note, due):
    uid = str(uuid.uuid4())
    cur = conn.cursor()
    post = time() * 1000
    update = time() * 1000
    status = 0
    row = (uid, title, note, status, post, update, due)
    cur.execute('INSERT INTO todos VALUES(?,?,?,?,?,?,?)',
                row)
    conn.commit()
    return wrapTask(row)


@route('/')
@route('/index')
@route('/home')
def _home():
    return static_file('home.html', './')

@get('/list')
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

    return json.dumps(todos)

@post('/toggle/<id>')
def _toggle(id):
    cur = conn.cursor()
    cur.execute('SELECT status FROM todos WHERE id=?', (id, ))
    bit = cur.fetchone()[0]
    bit = 1 if bit == 0 else 0
    cur.execute('UPDATE todos SET status=? WHERE id = ?', (bit, id))
    conn.commit()
    return '{ "status": ' + str(bit) + ' }'


@post('/new')
def newPost():
    bodyStr = request._get_body_string().decode()
    reqTask = json.loads(bodyStr)
    todo = newTodo(reqTask[u'title'], reqTask[u'note'], reqTask[u'due'])
    return json.dumps(todo)


@post('/edit/<id>')
def edit(id):
    bodyStr = request._get_body_string().decode()
    reqTask = json.loads(bodyStr)
    editTodo(id, reqTask[u'title'], reqTask[u'note'], reqTask[u'due'])
    return json.dumps(fetchTodo(id))


@post('/delete/<id>')
def delete(id):
    cur = conn.cursor()
    cur.execute('DELETE FROM todos WHERE id=?', (id, ))
    return '{}'


@route('/scripts/<script>')
def scripts(script):
    return static_file(script, './scripts')


@get('/fonts/roboto/<f>')
def font(f):
    return static_file(f, './fonts/roboto/')


@route('/css/<css>')
def css(css):
    return static_file(css, './css')

run(host='localhost', port=8080)
