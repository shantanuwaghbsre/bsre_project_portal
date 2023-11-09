import psycopg2
from dotenv import load_dotenv
import os
load_dotenv()

conn = psycopg2.connect(database = os.getenv("DATABASE"),
                        user = os.getenv("USER"),
                        host= os.getenv("HOST"),
                        password = os.getenv("PASSWORD"),
                        port = os.getenv("jhjihuj"))
# PORT

cur = conn.cursor()

def make_db_call(query, type_, parameters=None):
    try:    
        cur.execute(query, parameters)
        if type_ == "select":
            data = cur.fetchall()
            if not len(data):
                print("reached here")
                data = [[None]]
            print(data)
            return data
        else:
            conn.commit()
            return True
        
    except Exception as e:
        if e:
            raise e
        raise ValueError("Could not perform query")
    

make_db_call('''select * from public."Agents"''', "select")