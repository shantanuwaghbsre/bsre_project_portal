import psycopg2

conn = psycopg2.connect(database = "postgres", 
                        user = "postgres", 
                        host= 'localhost',
                        password = "bsre@1234",
                        port = 5432)

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
    