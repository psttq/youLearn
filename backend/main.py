from fastapi import FastAPI, Response, status

from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

import psycopg2

import uuid

from datetime import datetime, timedelta

class LoginItem(BaseModel):
    login: str
    password: str

class CheckTokenItem(BaseModel):
    token: str

origins = [
    "http://localhost:3000",
    "http://localhost:8080",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    conn = psycopg2.connect(database="youlearn", user="postgres")
    print("DB CONNECTED")
except psycopg2.OperationalError as e:
    print(f"Could not connect to Database: {e}")
    sys.exit(1)

cur = conn.cursor()


@app.post("/login")
async def login(item: LoginItem, response: Response):
    cur.execute("SELECT id FROM users WHERE login=%s AND password=%s", (item.login, item.password,))
    data = cur.fetchall()
    token = str(uuid.uuid4())
    if len(data) > 0:
        cur.execute("SELECT * FROM tokens WHERE user_id=%s", (data[0],))
        count = len(cur.fetchall())
        print(count)
        expiration_date = datetime.now() + timedelta(days=1)
        if count > 0:
            cur.execute("UPDATE tokens SET token=%s, expiration_date=%s WHERE user_id=%s", (token, expiration_date, data[0],))
        else:
            cur.execute("INSERT INTO tokens(user_id, token, expiration_date) VALUES(%s, %s, %s)", (data[0], token, expiration_date))
        conn.commit()
        return {"token": token, "expiration_date": expiration_date}
    else:
        response.status_code = status.HTTP_403_FORBIDDEN
        return {"err": "Not rigth password or login"}



@app.post("/registration")
async def registration(item: LoginItem, response: Response):
    cur.execute("SELECT * FROM users WHERE login=%s", (item.login,))
    data = cur.fetchall()
    print(data)
    if len(data) > 0:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"error": "Such login is already taken!"}
    else:
        cur.execute("INSERT INTO users(login, password) VALUES(%s, %s)", (item.login, item.password))
        conn.commit()
        return {"msg": "ok"}