
from fastapi import FastAPI, Response,status

from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware

import psycopg2

class LoginItem(BaseModel):
    login: str
    password: str
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
    cur.execute("SELECT * FROM users WHERE login=%s AND password=%s", (item.login, item.password,))
    data = cur.fetchall()
    if len(data) > 0 :
        return {"response": data}
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